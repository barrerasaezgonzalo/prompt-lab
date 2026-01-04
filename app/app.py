import os
import math
from uuid import UUID
from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles  
from fastapi.templating import Jinja2Templates 
from typing import Optional
from services.ai import generate_ai_prompt 
from services.database import save_prompt
from supabase import create_client, Client
from dotenv import load_dotenv
from constants import PAGINATE_SIZE

load_dotenv()
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

app = FastAPI() 
app.mount("/static", StaticFiles(directory="static"), name="static") 
templates = Jinja2Templates(directory="templates")

@app.get('/',response_class=HTMLResponse)
async def index(
    request: Request
): 
    return templates.TemplateResponse("index.html", {"request": request}) 

@app.post("/generate")
async def generate(
    user_input: str = Form(...), 
    user_id: Optional[UUID] = Form(None)
):    
    if len(user_input) < 5: 
        raise HTTPException(status_code=400, detail="El prompt es demasiado corto para mejorarlo.")
    try:        
        mejorado = generate_ai_prompt(user_input)
        if user_id and not mejorado.startswith("Error:"):
            save_prompt(user_id, user_input, mejorado)
    
        return {
            "mejorado": mejorado,
            "user_id": str(user_id) if user_id else None
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail="Error interno en el servidor")

@app.get("/get-history")
async def get_history(page: int = 1, search: str = "", user_id: str = None):
    if not user_id:
        return {"history": [], "total_paginas": 1, "error": "No user ID provided"}
    try:
        items_por_pagina = PAGINATE_SIZE 
        inicio = (page - 1) * items_por_pagina
        fin = inicio + items_por_pagina - 1
        
        query = supabase.table("prompts").select("*", count="exact").eq("user_id", user_id)
        
        if search and len(search.strip()) > 0:
            query = query.ilike("prompt_original", f"%{search.strip()}%")
        
        response = query.order("is_favorite", desc=True).order("created_at", desc=True).range(inicio, fin).execute()

        total_items = response.count if response.count is not None else 0
        total_paginas = math.ceil(total_items / items_por_pagina) if total_items > 0 else 1
            
        return {
            "history": response.data,
            "total_paginas": total_paginas,
            "pagina_actual": page
        }
    except Exception as e:
        print(f"Error en Python: {e}")
        return {"history": [], "total_paginas": 1, "error": str(e)}

@app.delete("/delete-prompt/{prompt_id}")
async def delete_prompt(prompt_id: str,user_id: str = None):
    if not user_id:
        return {"status": "error", "message": "No user ID provided"}
    try:
        supabase.table("prompts").delete().eq("id", prompt_id).eq("user_id", user_id).execute()
        return {"status": "success", "message": "Registro eliminado"}
    except Exception as e:
        return {"status": "error", "message": str(e)}, 500

@app.post("/update-prompt")
async def update_prompt(request: Request):
    try:        
        form_data = await request.form()
        prompt_id = form_data.get("prompt_id")
        nuevo_texto = form_data.get("nuevo_texto")
        user_id = form_data.get("user_id")

        if not prompt_id or not nuevo_texto:
            raise HTTPException(status_code=400, detail="Faltan datos")
        
        supabase.table("prompts").update({
            "prompt_original": nuevo_texto
        }).eq("id", prompt_id).eq("user_id", user_id).execute()

        return {"status": "success"}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/favorite/{prompt_id}")
async def favorite_prompt(prompt_id: str,user_id: str = None):
    if not user_id:
        return {"status": "error", "message": "No user ID provided"}
    try:
        prompt = supabase.table("prompts").select("*").eq("id", prompt_id).single().execute()
        if not prompt.data:
            raise HTTPException(status_code=404, detail="Prompt no encontrado")
        
        is_favorite = prompt.data["is_favorite"]
        supabase.table("prompts").update({
            "is_favorite": not is_favorite
        }).eq("id", prompt_id).eq("user_id", user_id).execute()

        return {"status": "success"}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))