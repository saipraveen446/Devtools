from fastapi import FastAPI
from tools import (
    base64_tools,
    json_tools,
    color_generator,
)

app = FastAPI()


@app.get("/")
def home():
    return {"message": "DevTools API Running"}


app.include_router(base64_tools.router, prefix="/base64", tags=["Base64 Tools"])
app.include_router(json_tools.router, prefix="/json", tags=["JSON Tools"])
app.include_router(color_generator.router, prefix="/color", tags=["Color Generator"])


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
