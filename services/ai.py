import os
from groq import Groq
from dotenv import load_dotenv
load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_ai_prompt(user_input: str):    
    texto_input = user_input.strip()    
    
    if len(texto_input) < 5: 
        return "Error: El prompt es demasiado corto para mejorarlo."

    prompt_final = f"""
    Toma el siguiente prompt de usuario y genera un prompt mejorado siguiendo estas secciones:
    "Title", "Objective", "Instructions", "Context", "Technical_Details", "Expected_Output".

    Reglas de Oro:
    - Actúa como un experto senior en el tema mencionado.
    - En "Instructions", no des consejos vagos; proporciona un paso a paso técnico y cronológico.
    - Añade una sección "Technical_Details" con herramientas, términos clave o conceptos avanzados que el usuario debe conocer.
    - Mantén la intención original pero eleva la complejidad técnica.
    - Devuelve solo el contenido estructurado, sin introducciones.

    Prompt original: "{input}"
    """

    try:
        completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt_final}],
            model="llama-3.3-70b-versatile"
        )        
        
        return completion.choices[0].message.content 

    except Exception as e:
        return f"Error al conectar con la IA: {str(e)}"   
