# AI Prompt Architect & Manager

A professional web application designed to transform simple user ideas into high-fidelity, structured AI prompts. This tool leverages prompt engineering principles to bridge the gap between vague requests and high-quality, actionable AI outputs.

## 🚀 Features

- **Prompt Structuring Engine:** Automatically converts brief inputs into a comprehensive framework: _Title, Objective, Instructions, Context, Technical Details,_ and _Expected Output_.
- **Full CRUD Integration:** Create, Read, Update, and Delete prompts with real-time synchronization via Supabase.
- **Favorites System:** Pin your most valuable prompts to the top of your list with a single click.
- **Persistent History:** Organized log of generated prompts with pagination for efficient management.
- **One-Click Copy:** Instant clipboard integration to move your engineered prompts directly into LLMs like ChatGPT or Claude.
- **Modern UX/UI:** Responsive design featuring dynamic SVG iconography, modal confirmations, and real-time state updates.

## 🛠️ Tech Stack

- **Frontend:** HTML5, Tailwind CSS, JavaScript (Vanilla ES6+)
- **Backend:** Python (FastAPI / Flask)
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS

## 📋 Database Schema (Supabase)

The application uses a table named `prompts` with the following structure:

| Column       | Type       | Description                    |
| :----------- | :--------- | :----------------------------- |
| id           | UUID / Int | Primary Key                    |
| created_at   | Timestamp  | Record creation date           |
| input        | Text       | User's original idea           |
| prompt_final | Text       | AI-generated structured prompt |
| is_favorite  | Boolean    | Flag for pinned items          |

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/barrerasaezgonzalo/prompt-lab](https://github.com/barrerasaezgonzalo/prompt-lab)
   ```
2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Environment Variables: Create a .env file and add your credentials:**
   ```bash
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   AI_API_KEY=your_llm_api_key
   ```
4. **Run the application:**
   `bash
 python app.py
 `
   **Prompt Engineering Logic**

The core value lies in the System Architect Prompt, which instructs the AI to:

Act as a Senior Expert in the relevant field.

Provide chronological, technical, and non-vague instructions.

Include a Technical Details section with specific tools and advanced concepts (e.g., JWT, Normalization, React Hooks).
