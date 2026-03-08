from fastapi import FastAPI
from pydantic import BaseModel
from pathlib import Path
from typing import Literal
from .ocr import evaluate_ocr, get_ocr_options

script_path = Path(__file__).resolve()
parent_project_path = script_path.parent.parent.parent
storage_path = parent_project_path / "backend" / "pb_data" / "storage"
print(f"Script path: {script_path}")
print(f"Storage path: {storage_path}")

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


class OCR_DIO(BaseModel):
    url: str
    task: Literal["course", "nr", "ac", "sr"]


@app.post("/ocr")
def create_item(payload: OCR_DIO):
    print(payload)
    ocr_options = get_ocr_options(payload.task)
    res = evaluate_ocr(filepath=(storage_path / payload.url).as_posix(), **ocr_options)
    return dict(**res, url=payload.url)
