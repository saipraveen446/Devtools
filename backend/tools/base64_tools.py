import base64
from fastapi import APIRouter

router = APIRouter()

@router.post("/encode")
def encode_text(text: str):
    """Encode text to base64"""
    encoded = base64.b64encode(text.encode()).decode()
    return {"encoded": encoded}

@router.post("/decode")
def decode_text(text: str):
    """Decode base64 text"""
    decoded = base64.b64decode(text).decode()
    return {"decoded": decoded}
