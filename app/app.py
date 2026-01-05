import os
import math
from uuid import UUID
from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles  
from fastapi.templating import Jinja2Templates 
from typing import Optional
from services.ai import generate_ai_prompt 
from services.database import insert_prompt_db, update_prompt_db
from supabase import create_client, Client
from dotenv import load_dotenv
from constants import PAGINATE_SIZE
from app.schemas import PromptRequest , PromptUpdate

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



@app.post("/generate-prompt")
async def generate(data: PromptRequest):    
    if len(data.user_input) < 5:
        raise HTTPException(status_code=400, detail="Por favor, escribe un poco más para poder mejorar tu prompt.")
    try:        
        improved_prompt = generate_ai_prompt(data.user_input)
        if len(improved_prompt) > 0:
            # save_prompt(data.user_id, data.user_input, mejorado)    
            return {
                "improved_prompt": improved_prompt,
                "user_id": str(data.user_id) if data.user_id else None
            }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error interno en el servidor")



@app.post("/insert-prompt")
async def insert_prompt_db(data: dict):
    if len(data.get("user_input")) < 5:
        raise HTTPException(status_code=400, detail="Por favor, escribe un poco más para poder mejorar tu prompt.")
    try:
        user_id = data.get("user_id")
        user_input = data.get("user_input")
        improved_prompt = data.get("improved_prompt")
        prompt_id = data.get("prompt_id")  # Esto vendrá si es una edición

        # Si tenemos prompt_id, es un UPDATE
        if prompt_id:
            response = supabase.table("prompts").update({
                "prompt_original": user_input,
                "prompt_mejorado": improved_prompt,
                "updated_at": "now()" # Supabase entiende esto
            }).eq("id", prompt_id).execute()
            
            return {"status": "updated", "id": prompt_id}

        # Si NO tenemos prompt_id, es un INSERT
        else:
            response = supabase.table("prompts").insert({
                "user_id": user_id,
                "prompt_original": user_input,
                "prompt_mejorado": improved_prompt
            }).execute()

            # Retornamos el ID que generó la base de datos
            new_id = response.data[0]["id"]
            return {"status": "created", "id": new_id}

    except Exception as e:
        print(f"Error en DB: {e}")
        raise HTTPException(status_code=500, detail="Error al procesar la base de datos")



@app.get("/get-history")
async def get_history(page: int = 1, search: str = "", user_id: str = None, only_favs: bool = False):
    if not user_id:
        return {"history": [], "total_paginas": 1, "error": "No user ID provided"}
    try:
        items_por_pagina = PAGINATE_SIZE 
        inicio = (page - 1) * items_por_pagina
        fin = inicio + items_por_pagina - 1
        
        query = supabase.table("prompts").select("*", count="exact").eq("user_id", user_id)

        if only_favs:
            query = query.eq("is_favorite", True)
        
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
async def update_prompt_db(data: PromptUpdate):
    user_input = data.user_input
    improved_prompt = data.improved_prompt
    user_id = data.user_id
    prompt_id = data.prompt_id
    try:        
        if len(user_input.strip()) < 5:
            raise HTTPException(status_code=400, detail="Por favor, escribe un poco más para poder mejorar tu prompt.")
        response = supabase.table("prompts").update({
            "prompt_original": user_input,
            "prompt_mejorado": improved_prompt
        }).eq("id", prompt_id).execute()
        return {"status": "success", "message": "Prompt actualizado correctamente"}
    except Exception as e:        
        raise HTTPException(status_code=500, detail=f"Error al actualizar: {str(e)}")



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