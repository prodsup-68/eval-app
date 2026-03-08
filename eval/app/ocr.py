import pytesseract
from PIL import Image
from rapidfuzz import fuzz
import re


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
