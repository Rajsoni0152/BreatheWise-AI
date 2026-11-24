import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from project root or backend folder
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip().strip('"').strip("'")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash").strip().strip('"').strip("'")
PORT = int(os.getenv("PORT", "8000"))
HOST = os.getenv("HOST", "0.0.0.0")

raw_origins = os.getenv("ALLOWED_ORIGINS", "*")
if raw_origins == "*":
    ALLOWED_ORIGINS = ["*"]
else:
    ALLOWED_ORIGINS = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]
