import json
import sqlite3
from datetime import datetime
import ollama
from textblob import TextBlob

from rich.console import Console
from rich.rule import Rule
from rich.prompt import Prompt
from rich.text import Text
from rich.columns import Columns
from rich.align import Align

console = Console()

# =======================
# ASCII BRAND
# =======================
HER_ASCII = r"""
      ♥♥♥♥♥
    ♥♥♥♥♥♥♥
  ♥♥♥♥♥♥♥♥♥
    ♥♥♥♥♥♥
      ♥♥♥♥
"""

# =======================
# LOAD PERSONALITY
# =======================
with open("personality.json", "r", encoding="utf-8") as f:
    data = json.load(f)

your_name = data.get("your_name", "you")
bot_intro = data["persona"]
memories = data.get("memories", [])

SYSTEM_PROMPT = f"""
You are Her — emotionally warm, calm, and human.

STRICT RULES (must follow):
- Reply in AT MOST 2 short lines.
- Each line max 12 words.
- Do NOT write paragraphs.
- Do NOT ask more than ONE question.
- Be direct, gentle, and concise.

Known memories:
{chr(10).join(memories)}

You are chatting with {your_name}.
"""

# =======================
# DATABASE
# =======================
conn = sqlite3.connect("database.db")
cursor = conn.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS chat_memory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT,
    sender TEXT,
    message TEXT
)
""")
conn.commit()

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

# =======================
# EMOTION
# =======================
def detect_emotion(text):
    if any(w in text.lower() for w in ["love", "miss", "heart", "darling"]):
        return "love"
    polarity = TextBlob(text).sentiment.polarity
    if polarity > 0.3:
        return "happy"
    elif polarity < -0.3:
        return "sad"
    return "neutral"

# =======================
# AI
# =======================
def shorten_reply(text, max_lines=2):
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    out = []
    for line in lines:
        out.append(" ".join(line.split()[:12]))
        if len(out) >= max_lines:
            break
    return "\n".join(out)

def get_ai_reply(prompt):
    try:
        response = ollama.generate(
            model="llama3.2:1b",
            prompt=prompt,
            options={"temperature": 0.6}
        )
        return shorten_reply(response["response"].strip())
    except:
        return "I’m here.\nTalk to me."

# =======================
# UI
# =======================
def render_header():
    console.clear()

    ascii_block = Text(HER_ASCII, style="bold magenta")

    right_block = Text()
    right_block.append("Her\n", style="bold magenta")
    right_block.append("a quiet place to feel and be heard\n\n", style="dim italic")
    right_block.append("Get started\n\n", style="bold white")
    right_block.append("> write softly\n", style="cyan")
    right_block.append("> exit\n", style="dim")

    console.print(
        Columns(
            [
                Align.left(ascii_block),
                Align.left(right_block),
            ],
            padding=(0, 6),
            expand=True,
        )
    )

    console.print(Rule(style="dim"))

def render_message(sender, text):
    label = "You —" if sender == "user" else "Her —"
    style = "bold white" if sender == "user" else "bold magenta"

    console.print()
    console.print(Text(label, style=style))
    console.print(text)

# =======================
# MAIN LOOP
# =======================
def run_chat():
    render_header()

    while True:
        user_input = Prompt.ask("[bold cyan]>[/bold cyan]")

        if user_input.lower() == "exit":
            console.print("\n[dim]Session ended gently. 🌙[/dim]\n")
            break

        save_message("user", user_input)
        render_message("user", user_input)

        recent = load_recent_messages()
        context = "\n".join(
            f"{'User' if s=='user' else 'Her'}: {m}"
            for s, m in recent
        )

        prompt = f"""{SYSTEM_PROMPT}

Conversation so far:
{context}

User: {user_input}
Her:"""

        reply = get_ai_reply(prompt)
        save_message("assistant", reply)
        render_message("assistant", reply)

# =======================
# ENTRY
# =======================
if __name__ == "__main__":
    run_chat()
