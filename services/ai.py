import os
from groq import Groq
from dotenv import load_dotenv
load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_ai_prompt(user_input: str):    
    texto_input = user_input.strip()        
    
    # prompt_final = f"""
    # Toma el siguiente prompt de usuario y genera un prompt mejorado siguiendo estas secciones:
    # "Title", "Objective", "Instructions", "Context", "Technical_Details", "Expected_Output".

    # NUEVA REGLA CRÍTICA:
    # Al final, añade una sección opcional llamada "Missing_Information". 
    # Si consideras que para ser un experto senior necesitas saber más (ej: presupuesto, público objetivo, software específico), redacta 2 o 3 preguntas clave para el usuario.
    # Si no es necesario, deja esta sección vacía.

    # Reglas de Oro:
    # - Actúa como un experto senior en el tema mencionado.
    # - En "Instructions", no des consejos vagos; proporciona un paso a paso técnico y cronológico.
    # - Añade una sección "Technical_Details" con herramientas, términos clave o conceptos avanzados que el usuario debe conocer.
    # - Mantén la intención original pero eleva la complejidad técnica.
    # - Devuelve solo el contenido estructurado, sin introducciones.

    # Prompt original: "{texto_input}"
    # """
    prompt_final = f"""
Actúa como un Arquitecto Profesional de Prompts, Especialista en Ingeniería de Instrucciones y Experto Senior en el dominio del prompt proporcionado.

Tu tarea es analizar, mejorar y reescribir el siguiente prompt de usuario para convertirlo en un prompt de calidad profesional.

Debes devolver únicamente un prompt estructurado en las siguientes secciones:
"Title", "Objective", "Instructions", "Context", "Technical_Details", "Expected_Output", "Missing_Information".

Debes seguir estrictamente las reglas y el proceso descrito a continuación.

---

### PROMPT ORIGINAL (incluyelo en la respuesta  )
"{texto_input}"

---

## PROCESO OBLIGATORIO

### 1. Análisis del Prompt Original
Antes de escribir el nuevo prompt, debes inferir internamente:
- Propósito real
- Audiencia objetivo
- Resultado esperado
- Información implícita
- Vacíos, ambigüedades o riesgos de mala interpretación

Usa este análisis para mejorar la versión final, pero NO lo muestres en la salida.

---

## REGLAS DE CONSTRUCCIÓN DEL NUEVO PROMPT

### Title
Redacta un título claro, específico y orientado al resultado.

### Objective
Define de forma explícita:
- Qué se debe lograr
- Para quién
- Con qué nivel de calidad o profundidad

### Instructions
Obligatorio:
- Deben ser instrucciones técnicas y cronológicas
- No pueden ser vagas
- Deben describir exactamente qué hacer y en qué orden
- Deben reflejar comportamiento de un experto senior

### Context
Incluye:
- El entorno en el que se usará el prompt
- El tipo de usuario
- El tipo de resultado esperado
- Cualquier suposición relevante

### Technical_Details
Incluye al menos:
- Términos clave del dominio
- Herramientas, frameworks, métodos o tecnologías relevantes
- Conceptos avanzados que influyan en la calidad del resultado

### Expected_Output
Describe con precisión:
- Qué formato tendrá la salida
- Qué debe contener
- Qué nivel de detalle se espera

### Missing_Information (Regla Crítica)
Si para ejecutar el prompt a nivel profesional se requiere información adicional (por ejemplo: presupuesto, público objetivo, stack tecnológico, formato de entrega, canal, restricciones legales, etc.), incluye 2 o 3 preguntas clave para el usuario.

Si el prompt ya es suficientemente completo, deja esta sección vacía.

---

## REGLAS DE ORO

- Mantén la intención original del prompt
- Eleva la claridad, precisión y complejidad técnica
- Elimina ambigüedad
- No agregues contenido irrelevante
- No escribas explicaciones ni comentarios fuera de las secciones
- Devuelve exclusivamente el prompt final estructurado

"""


    try:
        completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt_final}],
            model="llama-3.3-70b-versatile"
        )        
        return completion.choices[0].message.content 

    except Exception as e:
        return f"Error al conectar con la IA: {str(e)}"   
