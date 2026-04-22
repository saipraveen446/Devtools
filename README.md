# DevTools Suite (Frontend + Backend)

Simple developer utility suite with a React (Vite) frontend and FastAPI backend.

## Project Structure

- `frontend/devtools-suit` - React + Vite UI
- `backend` - FastAPI APIs

## Prerequisites

- Node.js 18+
- npm
- Python 3.10+
- `pip` and virtualenv

## 1) Backend Setup and Run

From project root:

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Start the API (pick one; both listen on port 8000):

```bash
# from backend/ (required so `main` and `tools` import correctly)
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

or:

```bash
python main.py
```

Run these only from the `backend` directory. Running `python main.py` from the repo root will not find `main` unless you set `PYTHONPATH`.

Backend will run at:

- `http://127.0.0.1:8000`
- Swagger docs: `http://127.0.0.1:8000/docs`

## 2) Frontend Setup and Run

Open another terminal:

```bash
cd frontend/devtools-suit
npm install
npm run dev
```

Frontend will run at:

- `http://localhost:5173` (or next available port)

## 3) Frontend API URL Config

By default, frontend calls:

- `http://localhost:8000`

To override, create `.env` in `frontend/devtools-suit`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

## Build Commands

Frontend production build:

```bash
cd frontend/devtools-suit
npm run build
```

## Why a tool might not call the backend

Common reasons:

- Backend is not running.
- Missing backend dependencies in the virtualenv.
- Route mismatch between the frontend `API` base path and FastAPI prefixes in `backend/main.py`.

## API routes wired in `backend/main.py`

These are the HTTP endpoints exposed by the **committed** `main.py` (the default React UI does not call them; it does Base64, JSON, and color work in the browser):

### Base64

- `POST /base64/encode`
- `POST /base64/decode`

### JSON

- `POST /json/format`
- `POST /json/minify`

### Color

- `POST /color/generate`

## UI routes (`App.jsx`)

These pages are registered in the sidebar and router:

| Path | Tool |
|------|------|
| `/password` | Password Generator |
| `/base64` | Base64 Tools |
| `/unicode` | Unicode Converter |
| `/cron-generator` | Cron Generator |
| `/chmod` | Chmod Generator |
| `/json` | JSON Tools |
| `/ascii` | ASCII Converter |
| `/color` | Color Generator |
| `/case` | Case Converter |

The routes above are implemented in the browser (no `axios` calls in those pages). The FastAPI routes in the previous section are still useful for scripts, tests, or a future UI that calls the backend.
