A powerful tool designed to transform simple ideas into professional AI prompts, featuring history management, favorites, and real-time editing.

## ✨ Features

- **Smart Refining:** Optimize your prompts using AI-driven logic.
- **Iterative Workflow:** Refine and improve the same prompt multiple times while maintaining its version history.
- **Full History:** Automatically save your creations to reuse them later.
- **Favorites System:** Mark your best prompts with ⭐ to find them instantly.
- **View Mode:** Inspect saved prompts without the risk of accidental edits (Read-only).
- **Optimized UX:** - Informative tooltips for better navigation.
  - Data loss prevention when clearing the editor.
  - Intelligent versioning (smart Update vs. Insert logic).

## 🛠️ Tech Stack

- **Frontend:** HTML5, Tailwind CSS, JavaScript (Vanilla ES6).
- **Backend:** Python with FastAPI.
- **Database:** Supabase (PostgreSQL).
- **AI:** Integration with Large Language Models.

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone hhttps://github.com/barrerasaezgonzalo/prompt-lab.git
   cd prompt-lab
   ```

2. **Set up virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Environment Variables:**
   Create a `.env` file and add your credentials:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_api_key
   OPENAI_API_KEY=your_ai_model_key
   ```

4. **Run the application:**
   ```bash
   uvicorn main:app --reload
   ```

## 📸 Screenshots
*(You can drag and drop an image of your app here once you upload it to GitHub)*

---
Developed with ❤️ to improve interaction with Large Language Models.