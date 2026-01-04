import {
  form,
  resultadoDiv,
  textoResultado,
  btnEnviar,
} from "./selectors.js";

import {
  idEnEdicion,
  setIdEnEdicion,
} from "./state.js";

import { cargarHistorial } from "./historial.js";
import { abrirModal } from "./modal.js";
import { getUsuarioLogueado } from './auth.js';

export function resetearFormulario() {
  setIdEnEdicion(null);
  document.getElementById("user_input").value = "";
  btnEnviar.innerText = "Generar Prompt Mejorado";
  btnEnviar.disabled = false;
  resultadoDiv.style.display = "none";
}

async function manejarSubmitPrompt(e) {
  e.preventDefault();
  const usuario = getUsuarioLogueado();
  const userInput = document.getElementById("user_input").value.trim();

  if (!userInput) {
    abrirModal({ titulo: "Error", mensaje: "Recuerda escribir un prompt." });
    return;
  }

  if (idEnEdicion) {
    const formData = new FormData();
    formData.append("prompt_id", idEnEdicion);
    formData.append("nuevo_texto", userInput);
    formData.append("user_id", usuario.id);

    const response = await fetch("/update-prompt", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      resetearFormulario();
      abrirModal({
        titulo: "¡Prompt Actualizado!",
        mensaje: "Prompt actualizado correctamente.",
      });
      cargarHistorial(1);
    }
    return;
  }

  btnEnviar.disabled = true;
  btnEnviar.innerText = "Generando...";

  try {
    const formData = new FormData(form);
    usuario &&
      formData.append("user_id", usuario.id);

    const response = await fetch("/generate", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error desconocido");
    }

    const data = await response.json();

    textoResultado.innerText = data.mejorado;
    resultadoDiv.style.display = "block";

    abrirModal({
      titulo: "¡Prompt Mejorado!",
      mensaje: usuario
        ? "Prompt mejorado generado."
        : "Inicia sesión para guardar el historial.",
    });    
    usuario && (await cargarHistorial(1));
  } catch (error) {    
    console.error(error);
    abrirModal({
      titulo: "Atención",
      mensaje: error.message, 
      esConfirmacion: false
    });
  } finally {
    btnEnviar.disabled = false;
    btnEnviar.innerText = "Generar Prompt Mejorado";
  }
}

export function copiarAlPortapapeles(texto) {
  if (!texto || texto === "Generando...") return;
  navigator.clipboard.writeText(texto);
  abrirModal({ titulo: "Copiado", mensaje: "Texto copiado." });
}

form.addEventListener("submit", manejarSubmitPrompt);
