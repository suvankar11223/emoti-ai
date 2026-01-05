# TODO: Implement AI Chatbot Features

## Feature 1: Smart Memory
- [x] Add IMPORTANT_KEYWORDS list and should_store_memory function to chatBot.py
- [x] Modify memory insert logic to only save user messages that pass the filter

## Feature 2: Emotion Detection + Response Style
- [x] Install textblob via pip install textblob
- [x] Add textblob to requirements.txt
- [x] Add detect_emotion function to chatBot.py
- [x] Integrate emotion detection into prompt building to adjust response style

## Feature 3: Memory Commands
- [x] Add /forget last command handling in chatBot.py
- [x] Add /search memory <keyword> command handling in chatBot.py

## Feature 4: Web UI (Streamlit)
- [x] Install streamlit via pip install streamlit
- [x] Add streamlit to requirements.txt
- [x] Create app.py with Streamlit UI
- [x] Refactor chatBot.py to expose a chat_with_ai function for the UI

## Feature 5: Terminal UI (Rich)
- [x] Install rich via pip install rich
- [x] Add rich to requirements.txt
- [x] Add rich UI elements to chatBot.py
- [x] Style user & AI messages with rich panels
- [x] Update chat loop to use rich prompts and panels
