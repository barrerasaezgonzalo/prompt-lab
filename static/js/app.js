// --- 1. ESTADO GLOBAL ---
let paginaActual = 1;
let totalPaginas = 1;
let busquedaActual = "";
let idEnEdicion = null;

// --- 2. SELECTORES ---
const form = document.getElementById("prompt-form");
const resultadoDiv = document.getElementById("contenedor-resultado");
const textoResultado = document.getElementById("texto-resultado");
const btnEnviar = document.getElementById("btn-enviar");
const cleanPromptsBtn = document.getElementById("clear-prompts");
const inputBusqueda = document.getElementById("input-busqueda");
const btnLimpiarBusqueda = document.getElementById("btn-limpiar-busqueda");
const listaHistorial = document.getElementById("lista-historial");
const templateHistorial = document.getElementById("template-historial");

// --- 3. FUNCIONES DE CARGA Y RENDERIZADO (HISTORIAL) ---

async function cargarHistorial(pagina = 1) {
  if (!usuarioLogueado) {
    return;
  }
  paginaActual = typeof pagina === "number" ? pagina : 1;

  const url = `/get-history?page=${paginaActual}&search=${encodeURIComponent(busquedaActual)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.history) {
      listaHistorial.innerHTML = "";
      totalPaginas = data.total_paginas;

      data.history.forEach((item) => {
        const clone = templateHistorial.content.cloneNode(true);

        const txtPrompt = clone.querySelector(".prompt-texto-li");
        if (txtPrompt) txtPrompt.textContent = item.prompt_original;

        const btnCargar = clone.querySelector(".btn-cargar-prompt");
        const btnEliminar = clone.querySelector(".btn-eliminar-prompt");
        const btnCopiar = clone.querySelector(".btn-copy-original");
        const btnEditar = clone.querySelector(".btn-editar");
        const btnFav = clone.querySelector(".btn-fav");

        if (btnCargar)
          btnCargar.setAttribute("data-prompt-completo", item.prompt_original);
        if (btnEliminar) btnEliminar.setAttribute("data-id", item.id);
        if (btnCopiar) {
          const textoFull = `--- PROMPT ORIGINAL ---\n${item.prompt_original}\n--- PROMPT MEJORADO ---\n${item.prompt_mejorado}`;
          btnCopiar.setAttribute("data-prompt-completo", textoFull);
        }
        if (btnEditar) {
          btnEditar.setAttribute("data-prompt-completo", item.prompt_original);
          btnEditar.setAttribute("data-prompt-id", item.id);
        }
        if (btnFav) {
          btnFav.setAttribute("data-id", item.id);
          btnFav.setAttribute("data-fav", item.is_favorite);
          const svg = btnFav.querySelector("svg");
          if (svg) {
            svg.setAttribute(
              "fill",
              item.is_favorite ? "currentColor" : "none",
            );
            if (item.is_favorite) {
              btnFav.classList.add("text-red-500");
            } else {
              btnFav.classList.remove("text-red-500");
            }
          }
        }

        listaHistorial.appendChild(clone);
      });

      actualizarUI();
    }
  } catch (error) {
    console.error("Error crítico al cargar historial:", error);
  }
}

function actualizarUI() {
  const spanInfo = document.getElementById("span-pagina-info");
  if (spanInfo)
    spanInfo.textContent = `Página ${paginaActual} de ${totalPaginas}`;

  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");

  if (btnPrev) {
    btnPrev.disabled = paginaActual <= 1;
    btnPrev.classList.toggle("opacity-30", btnPrev.disabled);
  }
  if (btnNext) {
    btnNext.disabled = paginaActual >= totalPaginas;
    btnNext.classList.toggle("opacity-30", btnNext.disabled);
  }
}

// --- 4. MANEJADORES DE FORMULARIO Y ACCIONES ---

async function manejarSubmitPrompt(e) {
  e.preventDefault();
  const userInput = document.getElementById("user_input").value.trim();

  if (!userInput) {
    abrirModal({ titulo: "Error", mensaje: "Recuerda escribir un prompt." });
    return;
  }
  if (idEnEdicion) {
    const formData = new FormData();
    formData.append("prompt_id", idEnEdicion);
    formData.append("nuevo_texto", userInput);

    const response = await fetch("/update-prompt", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      idEnEdicion = null;
      document.getElementById("btn-enviar").innerText =
        "Generar Prompt Mejorado";
      document.getElementById("user_input").value = "";
      abrirModal({
        titulo: "¡Prompt Actualizado!",
        mensaje: "Prompt Actualizado Correctamente.",
      });
      cargarHistorial(1);
    }
  } else {
    btnEnviar.disabled = true;
    btnEnviar.innerHTML = "Generando...";

    try {
      const formData = new FormData(form);
      if (usuarioLogueado) {
        formData.append("user_id", usuarioLogueado.id);
      }

      const response = await fetch("/generate", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      textoResultado.innerText = data.mejorado;
      resultadoDiv.style.display = "block";

      if (!usuarioLogueado) {
        abrirModal({
          titulo: "¡Prompt Mejorado!",
          mensaje:
            "He mejorado tu prompt, pero recuerda que para guardarlo en tu historial y verlo después debes iniciar sesión.",
        });
      } else {
        abrirModal({
          titulo: "¡Prompt Mejorado!",
          mensaje: "Prompt Mejorado Generado.",
        });
        await cargarHistorial(1);
      }
    } catch (error) {
      console.error("Error al generar:", error);
    } finally {
      btnEnviar.disabled = false;
      btnEnviar.innerHTML = "Prompt Mejorado Generado";
    }
  }
}

function copiarAlPortapapeles(texto) {
  if (!texto || texto === "Generando...") return;
  navigator.clipboard.writeText(texto).then(() => {
    abrirModal({
      titulo: "Copiado",
      mensaje: "Texto copiado al portapapeles.",
    });
  });
}

// --- 5. MODALES ---

function abrirModal({
  titulo,
  mensaje,
  esConfirmacion = false,
  alConfirmar = null,
  textoConfirmar = "Confirmar",
}) {
  const modal = document.getElementById("modal-container");
  const btnAccion = document.getElementById("btn-accion");
  const btnSecundario = document.getElementById("btn-secundario");

  document.getElementById("modal-titulo").innerText = titulo;
  document.getElementById("modal-mensaje").innerText = mensaje;

  if (esConfirmacion) {
    btnAccion.innerText = textoConfirmar;
    btnAccion.classList.remove("hidden");
    btnAccion.onclick = async () => {
      await alConfirmar();
      cerrarModal();
    };
    btnSecundario.innerText = "Cancelar";
  } else {
    btnAccion.classList.add("hidden");
    btnSecundario.innerText = "Entendido";
  }
  modal.classList.remove("hidden");
}

function cerrarModal() {
  document.getElementById("modal-container").classList.add("hidden");
}

// --- 6. EVENTOS ---

form.addEventListener("submit", manejarSubmitPrompt);
if (cleanPromptsBtn) {
  cleanPromptsBtn.addEventListener("click", () => {
    resultadoDiv.style.display = "none";
    form.reset();
    btnEnviar.innerHTML = "Generar Prompt Mejorado";
  });
}

inputBusqueda.addEventListener("input", (e) => {
  busquedaActual = e.target.value;
  cargarHistorial(1);
});

btnLimpiarBusqueda.addEventListener("click", () => {
  inputBusqueda.value = "";
  busquedaActual = "";
  cargarHistorial(1);
});

document.getElementById("btn-prev").addEventListener("click", () => {
  if (paginaActual > 1) cargarHistorial(paginaActual - 1);
});
document.getElementById("btn-next").addEventListener("click", () => {
  if (paginaActual < totalPaginas) cargarHistorial(paginaActual + 1);
});

listaHistorial.addEventListener("click", async (e) => {
  const btnEliminar = e.target.closest(".btn-eliminar-prompt");
  if (btnEliminar) {
    const id = btnEliminar.getAttribute("data-id");
    abrirModal({
      titulo: "¿Eliminar?",
      mensaje: "Esto borrará el registro permanentemente.",
      esConfirmacion: true,
      alConfirmar: async () => {
        await fetch(`/delete-prompt/${id}`, { method: "DELETE" });
        cargarHistorial(paginaActual);
      },
    });
  }

  const btnCargar = e.target.closest(".btn-cargar-prompt");
  if (btnCargar) {
    document.getElementById("user_input").value = btnCargar.getAttribute(
      "data-prompt-completo",
    );
  }

  const btnCopiar = e.target.closest(".btn-copy-original");
  if (btnCopiar) {
    copiarAlPortapapeles(btnCopiar.getAttribute("data-prompt-completo"));
  }

  const btnEditar = e.target.closest(".btn-editar");
  if (btnEditar) {
    document.getElementById("user_input").value = btnEditar.getAttribute(
      "data-prompt-completo",
    );
    idEnEdicion = btnEditar.getAttribute("data-prompt-id");
    const btnEnviar = document.getElementById("btn-enviar");
    btnEnviar.innerText = "Actualizar Prompt";
  }

  const btnFav = e.target.closest(".btn-fav");
  if (btnFav) {
    const id = btnFav.getAttribute("data-id");
    const isFav = btnFav.getAttribute("data-fav");
    abrirModal({
      titulo: "Favorito!",
      mensaje: `Estas seguro que deseas ${isFav === "true" ? "desmarcar" : "marcar"} este Prompt como Favorito?.`,
      esConfirmacion: true,
      alConfirmar: async () => {
        await fetch(`/favorite/${id}`, { method: "GET" });
        cargarHistorial(paginaActual);
      },
    });
  }
});

document
  .getElementById("btn-copiar-resultado")
  ?.addEventListener("click", () => {
    copiarAlPortapapeles(textoResultado.innerText);
  });

document.addEventListener("DOMContentLoaded", () => cargarHistorial(1));
