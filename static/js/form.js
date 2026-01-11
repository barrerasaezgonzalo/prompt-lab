import {
  form,
  resultContainer,
  resultText,
  generateBtn,
  saveBtn,
} from "./selectors.js";

import {
  setInCreation,
  idEnEdicion,
  setIdEnEdicion,
  currentDraft,
  setCurrentDraft,
} from "./state.js";

import { cargarHistorial } from "./historial.js";
import { showToast } from "./modal.js";
import { getUsuarioLogueado } from "./auth.js";

let isGenerating = false;

export function resetearFormulario() {
  setIdEnEdicion(null);
  document.getElementById("user_input").value = "";
  if (saveBtn) {
    saveBtn.style.display = "none";
  }
  setCurrentDraft("");
  generateBtn.innerText = "Generar Prompt Mejorado";
  generateBtn.disabled = false;
  resultContainer.style.display = "none";
}

async function manejarSubmitPrompt(e) {
  e.preventDefault();
  if (isGenerating) return;

  const usuario = getUsuarioLogueado();
  const userInput = document.getElementById("user_input").value.trim();

  setIdEnEdicion(idEnEdicion ? idEnEdicion : null);
  setInCreation(true);

  isGenerating = true;
  generateBtn.disabled = true;
  generateBtn.innerText = "Generando...";

  try {
    const response = await fetch("/generate-prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_input: userInput,
        user_id: usuario?.id || null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail);
    }

    const data = await response.json();
    const [promptPart, questionsPart] = data.improved_prompt.split(
      "Missing_Information",
    );

    setCurrentDraft(promptPart.trim());
    resultText.innerText = currentDraft;

    const questionsBox = document.getElementById("iteration-questions");
    const questionsText = document.getElementById("questions-text");

    if (questionsPart?.trim()) {
      questionsText.innerText = questionsPart.trim();
      questionsBox.style.display = "block";
    } else {
      questionsBox.style.display = "none";
    }

    resultContainer.style.display = "block";
    saveBtn.style.display = "block";

    showToast({
      title: "Generado",
      message: usuario
        ? "IA ha respondido"
        : "Conectate para poder guardar tu historial",
      type: "success",
    });
  } catch (error) {
    console.error("Error:", error);
    showToast({ type: "warning", title: "Error", message: error.message });
  } finally {
    isGenerating = false;
    generateBtn.disabled = false;
    generateBtn.innerText = "Generar Prompt Mejorado";
  }
}

saveBtn.addEventListener("click", async () => {
  const usuario = getUsuarioLogueado();
  if (!usuario)
    return showToast({
      title: "Acceso denegado",
      message: "Loguéate",
      type: "error",
    });

  if (!currentDraft) return;

  const userInput = document.getElementById("user_input").value.trim();
  const payload = {
    user_input: userInput,
    user_id: usuario.id,
    improved_prompt: currentDraft,
    ...(idEnEdicion && { prompt_id: idEnEdicion }),
  };

  try {
    saveBtn.disabled = true;
    const url = idEnEdicion ? "/update-prompt" : "/insert-prompt";

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await response.json();
    if (!idEnEdicion) {
      setIdEnEdicion(res.id);
      setInCreation(false);
    }

    showToast({
      title: "¡Éxito!",
      message: "Los cambios fueron guardados correctamente",
      type: "success",
    });
    cargarHistorial(1);
  } catch (error) {
    showToast({ title: "Error", message: error.message, type: "error" });
  } finally {
    saveBtn.disabled = false;
  }
});

export function copiarAlPortapapeles(texto) {
  if (!texto || texto === "Generando...") return;
  navigator.clipboard.writeText(texto);
  showToast({
    title: "Copiando",
    message: `Texto Copiado Correctamente`,
    type: "info",
  });
}

form.addEventListener("submit", manejarSubmitPrompt);
