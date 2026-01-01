import os
from dotenv import load_dotenv
from uuid import UUID 
from supabase import create_client, Client
load_dotenv()
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

def save_prompt(user_id: UUID, original_prompt: str, improved_prompt: str):
    try:
        nuevo_registro = {
            "user_id": str(user_id),
            "prompt_original": original_prompt,
            "prompt_mejorado": improved_prompt
        }
        
        supabase.table("prompts").insert(nuevo_registro).execute()
        
        print(f"✅ Guardado exitoso para: {user_id}")
        return True
    except Exception as e:
        print(f"❌ Error al guardar en DB: {e}")
        return False