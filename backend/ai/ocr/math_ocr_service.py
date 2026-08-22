"""
Mathematical OCR Service Abstraction Layer.
Provides the interface and implementations for extracting real LaTeX formulas
from mathematical images entirely in-memory (Zero Disk I/O).

Includes APIKeyRotator for high-throughput multi-key rotation and rate-limit failover.
"""

from __future__ import annotations

import json
import os
import threading
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Optional, List, Union

from dotenv import load_dotenv

# Ensure .env variables are automatically loaded
ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent
load_dotenv(dotenv_path=ROOT_DIR / ".env", override=False)
load_dotenv(dotenv_path=ROOT_DIR / "backend" / ".env", override=False)
load_dotenv(override=False)

import numpy as np
from PIL import Image
from backend.ai.ocr.image_processing import cv2_to_pil


def parse_api_keys(raw_input: Optional[Union[str, List[str]]] = None) -> List[str]:
    """
    Parse a list of API keys from:
    1. A Python list: ["key1", "key2"]
    2. A JSON array string: '["key1", "key2"]'
    3. A Comma-separated string: "key1,key2,key3"
    4. A single string: "key1"
    5. Fallback to GEMINI_API_KEYS or GEMINI_API_KEY environment variables.
    """
    if isinstance(raw_input, list):
        return [str(k).strip().strip('"').strip("'") for k in raw_input if str(k).strip()]

    if raw_input is None:
        raw_input = os.getenv("GEMINI_API_KEYS") or os.getenv("GEMINI_API_KEY")

    if not raw_input:
        return []

    raw_input = raw_input.strip()
    if not raw_input:
        return []

    # JSON Array syntax: '["key1", "key2"]'
    if raw_input.startswith("[") and raw_input.endswith("]"):
        try:
            parsed = json.loads(raw_input)
            if isinstance(parsed, list):
                return [str(k).strip().strip('"').strip("'") for k in parsed if str(k).strip()]
        except Exception:
            pass

    # Comma or semicolon or newline separated syntax
    keys = [
        k.strip().strip('"').strip("'")
        for k in raw_input.replace("\n", ",").replace(";", ",").split(",")
        if k.strip().strip('"').strip("'")
    ]
    return keys


class APIKeyRotator:
    """
    Thread-safe Round-Robin API Key Rotator with Automatic Failover for Rate Limits.
    Mitigates HTTP 429 (Resource Exhausted) and balances load evenly across multiple keys.
    """

    def __init__(self, keys: Optional[List[str]] = None):
        self.keys: List[str] = keys or []
        self._lock = threading.Lock()
        self._index: int = 0

    def add_keys(self, keys: List[str]) -> None:
        with self._lock:
            for k in keys:
                if k and k not in self.keys:
                    self.keys.append(k)

    def get_ordered_candidates(self) -> List[str]:
        """
        Get all keys ordered by round-robin priority.
        If the primary key hits a rate limit (429), the caller can fall back to the next key.
        """
        with self._lock:
            if not self.keys:
                return []
            idx = self._index % len(self.keys)
            self._index = (self._index + 1) % len(self.keys)
            # Reorder so current index comes first, followed by others
            return self.keys[idx:] + self.keys[:idx]


class MathOCRService(ABC):
    """
    Abstract Base Class for Mathematical OCR inference services.
    Enables seamless swapping between Mock, Local Neural Models, and Cloud Vision APIs.
    """

    @abstractmethod
    async def extract_latex(self, image: np.ndarray) -> str:
        """
        Extract LaTeX representation from an image matrix.

        Args:
            image: Preprocessed OpenCV image matrix (uint8).

        Returns:
            str: Extracted LaTeX formula string.
        """
        pass


class MockMathOCRService(MathOCRService):
    """
    High-performance Mock Math OCR Service for testing and offline development.
    Demonstrates zero-disk in-memory PIL transition and returns representative LaTeX formulas.
    """

    def __init__(self, default_latex: str = r"\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}"):
        self.default_latex = default_latex

    async def extract_latex(self, image: np.ndarray) -> str:
        """
        Simulate OCR inference on the preprocessed image in RAM.
        """
        pil_image: Image.Image = cv2_to_pil(image)
        assert pil_image.size[0] > 0 and pil_image.size[1] > 0, "Invalid in-memory PIL Image dimensions"
        return self.default_latex


class GeminiMathOCRService(MathOCRService):
    """
    Production-grade Mathematical OCR Service powered by Google Gemini Multimodal AI.
    Features:
    - Multi-key rotation (Round-Robin) to prevent rate limit bottlenecks on high traffic.
    - Automatic Failover: If Key A hits HTTP 429, immediately retries with Key B.
    - Multi-model fallback across Gemini 2.0 / 2.5 / 1.5 Flash variants.
    - Strict Zero Disk I/O (all image tensors remain in RAM).
    """

    CANDIDATE_MODELS: List[str] = [
        "gemini-2.0-flash",
        "gemini-2.5-flash",
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-flash-001",
        "gemini-1.5-flash-002",
        "gemini-1.5-pro",
        "gemini-pro-vision",
    ]

    def __init__(
        self,
        api_keys: Optional[Union[str, List[str]]] = None,
        model_name: Optional[str] = None
    ):
        parsed_keys = parse_api_keys(api_keys)
        self.rotator = APIKeyRotator(parsed_keys)
        self.preferred_model = model_name or os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

        if not self.rotator.keys:
            raise ValueError(
                "No Gemini API keys found. Please set GEMINI_API_KEYS (or GEMINI_API_KEY) in your .env file or environment."
            )

    async def extract_latex(self, image: np.ndarray) -> str:
        """
        Send the enhanced image from RAM directly to Gemini Vision to recognize real math formulas.
        Rotates across available keys and tries compatible models with automatic failover.
        """
        pil_image: Image.Image = cv2_to_pil(image)

        prompt = (
            "You are an expert Mathematical OCR system. "
            "Examine this image carefully and extract all mathematical formulas, equations, and expressions. "
            "Convert the mathematical expressions into clean, standard LaTeX syntax. "
            "Output ONLY the raw LaTeX string without markdown code fences (do NOT wrap in ```latex ... ```), "
            "and without any conversational prefix or explanation."
        )

        candidate_keys = self.rotator.get_ordered_candidates()
        models_to_try = [self.preferred_model] + [m for m in self.CANDIDATE_MODELS if m != self.preferred_model]
        last_error = None

        # Iterate through rotated keys (Failover logic on rate limit / error)
        for key in candidate_keys:
            # 1. Primary: Modern google.genai SDK
            try:
                from google import genai
                client = genai.Client(api_key=key)
                for model_name in models_to_try:
                    try:
                        response = client.models.generate_content(
                            model=model_name,
                            contents=[prompt, pil_image],
                        )
                        text = (response.text or "").strip()
                        if text:
                            return self._clean_latex(text)
                    except Exception as exc:
                        last_error = exc
                        err_str = str(exc).lower()
                        # If model not found, try next model with same key
                        if "404" in err_str or "not found" in err_str:
                            continue
                        # If rate limited (429) or invalid key (400/403), break to next key
                        if "429" in err_str or "quota" in err_str or "resource_exhausted" in err_str or "key not valid" in err_str:
                            break
            except ImportError:
                pass

            # 2. Secondary: Legacy google.generativeai SDK
            try:
                import google.generativeai as legacy_genai
                legacy_genai.configure(api_key=key)
                for model_name in models_to_try:
                    try:
                        gen_model = legacy_genai.GenerativeModel(model_name)
                        response = gen_model.generate_content([prompt, pil_image])
                        text = (response.text or "").strip()
                        if text:
                            return self._clean_latex(text)
                    except Exception as exc:
                        last_error = exc
                        err_str = str(exc).lower()
                        if "404" in err_str or "not found" in err_str:
                            continue
                        if "429" in err_str or "quota" in err_str or "resource_exhausted" in err_str or "key not valid" in err_str:
                            break
            except ImportError:
                pass

        raise RuntimeError(
            f"Failed to extract math formulas using Gemini. Tried {len(candidate_keys)} API key(s). "
            f"Last error encountered: {str(last_error)}"
        )

    @staticmethod
    def _clean_latex(latex_text: str) -> str:
        """
        Clean markdown backticks and code blocks from the raw response string.
        """
        latex_text = latex_text.strip()
        if latex_text.startswith("```latex"):
            latex_text = latex_text[len("```latex"):].strip()
        if latex_text.startswith("```"):
            latex_text = latex_text[3:].strip()
        if latex_text.endswith("```"):
            latex_text = latex_text[:-3].strip()
        return latex_text.strip()
