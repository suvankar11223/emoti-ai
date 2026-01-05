from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import ollama
import json
import sqlite3
from datetime import datetime
from textblob import TextBlob

app = FastAPI()

# Allow React to talk to Python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

# Load personality
with open("personality.json", "r", encoding="utf-8") as f:
    data = json.load(f)

bot_intro = data["persona"]
memories = data.get("memories", [])
SYSTEM_PROMPT = f"""
{bot_intro}

You are a caring, emotional presence.
Speak gently. Be reflective. Feel human.
"""

# Database setup
conn = sqlite3.connect("database.db", check_same_thread=False)
cursor = conn.cursor()

def detect_emotion(text):
    polarity = TextBlob(text).sentiment.polarity
    if polarity > 0.3:
        return "happy"
    elif polarity < -0.3:
        return "sad"
    return "neutral"

def save_message(sender, message):
    cursor.execute(
        "INSERT INTO chat_memory VALUES (NULL, ?, ?, ?)",
        (datetime.now().isoformat(), sender, message)
    )
    conn.commit()

def load_recent_messages(n=6):
    cursor.execute(
        "SELECT sender, message FROM chat_memory ORDER BY id DESC LIMIT ?",
        (n,)
    )
    return list(reversed(cursor.fetchall()))

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    # Save user message
    save_message("user", req.message)

    # Detect emotion and get recent context
    emotion = detect_emotion(req.message)
    recent = load_recent_messages(6)

    context = "\n".join(
        f"{'User' if s=='user' else 'Her'}: {m}"
        for s, m in recent
    )

    emotion_hint = {
        "sad": "Respond gently, emotionally supportive, comforting.",
        "happy": "Respond warmly and affectionately.",
        "neutral": "Respond softly and thoughtfully."
    }[emotion]

    prompt = f"""
{SYSTEM_PROMPT}
{emotion_hint}

Recent diary:
{context}

User: {req.message}
Her:
"""

    try:
        response = ollama.generate(
            model="llama3.2:latest",
            prompt=prompt,
            options={"temperature": 0.85}
        )

        reply = response.get("response", "").strip()
    except Exception as e:
        reply = f"Error: {str(e)}"

    # Save AI response
    save_message("her", reply)

    return {"reply": reply}
