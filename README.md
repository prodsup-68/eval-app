# Eval App

End-to-end evaluation app where learners upload screenshot evidence, OCR scores the evidence, and PocketBase stores the results and user evaluation status.

## Project Structure

```
eval-app/
├─ backend/    # PocketBase backend (auth, uploads, hooks, storage)
├─ eval/       # FastAPI OCR service (Python)
├─ frontend/   # React + Vite frontend (TypeScript)
└─ prototype/  # OCR experimentation notebooks
```

## How It Works

1. A user uploads an image record to PocketBase `uploads`.
2. PocketBase hook (`backend/pb_hooks/upload.pb.js`) sets the `user` field.
3. After create, the hook calls `POST http://127.0.0.1:8000/ocr`.
4. FastAPI reads the uploaded image from `backend/pb_data/storage/...` and runs OCR.
5. Hook writes back `weighted_score` and `score_details` to `uploads`.
6. Hook updates user flags (`is_eval_class`, `is_eval_nr`) based on score threshold.

## Prerequisites

- Node.js 20+ and `pnpm`
- Python 3.12+
- [`uv`](https://docs.astral.sh/uv/) (recommended Python package manager/runner)
- [PocketBase](https://pocketbase.io/)
- Tesseract OCR engine installed on your OS (required by `pytesseract`)

### Tesseract Notes

- You must install Tesseract binary separately; `pip` does not install it.
- OCR options currently use Thai language (`lang="tha"`), so install Thai trained data as well.
- If needed on Windows, ensure `tesseract.exe` is on `PATH`.

## Local Development Setup

### 1) Backend (PocketBase)

From the repo root:

```powershell
cd backend
```

Download and run PocketBase (example uses v0.36.6 from existing docs):

```powershell
Invoke-WebRequest https://github.com/pocketbase/pocketbase/releases/download/v0.36.6/pocketbase_0.36.6_windows_amd64.zip -OutFile pocketbase.zip
Expand-Archive pocketbase.zip -DestinationPath .
.\pocketbase.exe serve --http="0.0.0.0:8090"
```

PocketBase admin UI/API will be available at `http://127.0.0.1:8090`.

### 2) OCR Service (FastAPI)

Open another terminal:

```powershell
cd eval
uv sync
uv run fastapi dev app/main.py --port 8000
```

Service is available at `http://127.0.0.1:8000`.

### 3) Frontend (React)

Open another terminal:

```powershell
cd frontend
pnpm install
pnpm dev
```

Frontend runs on Vite default URL (usually `http://127.0.0.1:5173`).

## API (OCR Service)

### `POST /ocr`

Request body:

```json
{
  "url": "pbc_548313937/<recordId>/<filename>.jpg",
  "task": "course"
}
```

Supported tasks in current Python implementation:

- `course`
- `nr`

> Note: PocketBase schema allows `ac` and `sr`, but OCR logic currently raises `ValueError` for those tasks until implemented in `eval/app/ocr.py`.

## Important Collections

- `users` (auth collection)
  - Evaluation flags: `is_eval_class`, `is_eval_nr`, `is_eval_ac`, `is_eval_sr`
- `uploads`
  - Fields: `image`, `user`, `task`, `weighted_score`, `score_details`

## Prototype Folder

`prototype/` contains exploratory notebooks and sample images used during OCR development. It is not required to run the production flow.

## Useful Commands

- FastAPI dev: `uv run fastapi dev app/main.py`
- FastAPI prod-style run: `uv run fastapi run app/main.py`
- Frontend build: `pnpm build`
- Frontend lint: `pnpm lint`

## Troubleshooting

- OCR fails with Tesseract error:
  - Confirm Tesseract binary is installed and on `PATH`.
  - Confirm Thai language data is installed.
- Hook cannot call OCR API:
  - Ensure FastAPI is running on `127.0.0.1:8000`.
- Missing image file in OCR:
  - Verify PocketBase is run from `backend/` so storage resolves under `backend/pb_data/storage`.
