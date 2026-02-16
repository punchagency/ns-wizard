# Walkthrough Generator Agent

An AI-powered agent designed to navigate websites and generate step-by-step walkthroughs for specific user goals. This system uses **LangGraph** for state management, **Playwright** for browser automation, and **OpenAI's GPT-4o** for planning and reasoning.

## 🚀 Features

- **Automated UI Extraction**: Scrapes and analyzes web pages to identify interactive elements (buttons, links, headings).
- **Intelligent Planning**: Generates navigation plans based on user goals and available UI elements.
- **Autonomous Execution**: Executes planned actions (clicks, navigation) in a headless browser.
- **Validation**: Verifies if the goal has been achieved based on page content.
- **Human-Readable Output**: Converts technical execution steps into friendly, easy-to-follow user guides.
- **API Access**: Exposes functionality via a FastAPI interface.

## 🛠️ Tech Stack

- **Python 3.9+**
- **FastAPI**: Web server and API interface.
- **LangGraph**: Agent state machine and workflow orchestration.
- **Playwright**: Headless browser automation.
- **LangChain & OpenAI**: LLM integration for reasoning.

## 📋 Prerequisites

- Python 3.9 or higher installed.
- An OpenAI API Key.

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Walkthrough
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Playwright browsers:**
   ```bash
   playwright install
   ```

4. **Environment Configuration:**
   Create a `.env` file in the root directory and add your OpenAI API key. Note that the application expects the variable name `api_key`.

   ```env
   # .env
   api_key=your_openai_api_key_here
   ```

## ▶️ Usage

### Running the Server

Start the FastAPI server using `main.py`:

```bash
python main.py
```
The server will start on `http://127.0.0.1:8000`.

### API Endpoint

**POST** `/walkthrough`

Generates a walkthrough for a given URL and user request.

**Request Body:**

```json
{
  "url": "https://www.example.com",
  "user_request": "How do I reset my password?",
  "thread_id": "session_123"
}
```

- `url`: The starting URL for the walkthrough.
- `user_request`: The goal or question you want the agent to solve.
- `thread_id`: A unique identifier for the session (used for memory/checkpointing).

**Response:**

Returns a JSON object containing the step-by-step walkthrough or a "Not found" message.

```json
{
  "result": "1. Click on 'Log In' at the top right.\n2. Click on 'Forgot Password?'.\n3. Enter email and submit."
}
```

## 📂 Project Structure

- `main.py`: FastAPI entry point and API route definitions.
- `agent.py`: Core logic for the LangGraph agent (extraction, planning, execution).
- `graph.py`: Alternative/Legacy engine implementation.
- `schemas.py`: Pydantic models for API request/response validation.
- `frontend/`: Directory for frontend assets (if applicable).
