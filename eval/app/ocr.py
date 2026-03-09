import re
import subprocess

import pytesseract
from PIL import Image
from rapidfuzz import fuzz


def test_tesseract():
    # Test if tesseract is installed and accessible
    try:
        result = subprocess.run(
            ["tesseract", "--version"], capture_output=True, text=True
        )
        if result.returncode == 0:
            print("Tesseract OCR is installed and accessible.")
        else:
            print("Tesseract OCR is not accessible. Please check your installation.")
    except FileNotFoundError:
        raise RuntimeError(
            "Tesseract OCR is not installed. Please install it to use the OCR functionality."
        )

    # Check if the Thai language data is available
    try:
        languages = pytesseract.get_languages()
        if "tha" in languages:
            print("Tesseract OCR Thai language data is available.")
        else:
            print("Tesseract OCR Thai language data is not available.")
    except Exception as e:
        raise RuntimeError(
            f"Error checking Tesseract OCR languages: {e}. Please ensure that the Thai language data is installed."
        )


def get_ocr_options(task):
    if task == "course":
        return dict(
            language="tha",
            matching_texts=[
                "255441",
                "ประเมินแล้ว",
            ],
            weights=[0.5, 0.5],
        )
    elif task == "nr":
        return dict(
            language="tha",
            matching_texts=[
                "255441",
                "นิรันดร์",
                "พิสุทธอานนท์",
                "ประเมินแล้ว",
            ],
            weights=[0.1, 0.3, 0.3, 0.3],
        )
    else:
        raise ValueError(f"Unknown task: {task}")


def evaluate_ocr(filepath, language, matching_texts, weights):
    _text = pytesseract.image_to_string(Image.open(filepath), lang=language).strip()
    text = re.sub(r"\s+", " ", _text)
    text = re.sub(r"\n+", " ", text)

    scores = []
    for matching_text in matching_texts:
        score = fuzz.partial_ratio(matching_text, text)
        scores.append(dict(matching_text=matching_text, score=score))
    weighted_score = sum(
        score["score"] * weight for score, weight in zip(scores, weights)
    )
    return dict(
        scores=scores,
        weighted_score=weighted_score,
        ocr_text=text,
        filepath=filepath,
        language=language,
    )
