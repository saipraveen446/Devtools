import json
from typing import Any

from fastapi import APIRouter, Body

router = APIRouter()


@router.post("/format")
def format_json(payload: Any = Body(...)):
    """Pretty-print JSON with indentation."""
    return json.dumps(payload, indent=4)


@router.post("/minify")
def minify_json(payload: Any = Body(...)):
    """Compact JSON (no extra whitespace)."""
    return json.dumps(payload, separators=(",", ":"))
