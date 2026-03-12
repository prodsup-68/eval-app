from pathlib import Path
from typing import Literal

from fastapi import FastAPI
from pydantic import BaseModel

from .ocr import evaluate_ocr, get_ocr_options, test_tesseract

# Define paths
script_path = Path(__file__).resolve()
parent_project_path = script_path.parent.parent.parent
storage_path = parent_project_path / "backend" / "pb_data" / "storage"
print(f"Script path: {script_path}")
print(f"Storage path: {storage_path}")
# Test if tesseract is installed and accessible
test_tesseract()

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


class OCR_DIO(BaseModel):
    url: str
    task: Literal["course", "nr", "ac", "sr"]


@app.post("/ocr")
def create_item(payload: OCR_DIO):
    # For testing purposes, we can set mock to True to avoid running actual OCR
    mock = True
    ocr_options = get_ocr_options(payload.task)
    res = evaluate_ocr(
        filepath=(storage_path / payload.url).as_posix(), **ocr_options, mock=mock
    )
    return dict(**res, url=payload.url)
