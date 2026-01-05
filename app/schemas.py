from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID

class PromptRequest(BaseModel):
    # El usuario envía esto para generar
    user_input: str = Field(..., max_length=5000)
    user_id: Optional[UUID] = None

class PromptResponse(BaseModel):
    # Lo que tu API devuelve (opcional, pero buena práctica)
    mejorado: str
    user_id: Optional[str]

class PromptUpdate(BaseModel):
    prompt_id: UUID
    user_id: UUID
    user_input: str
    improved_prompt: str