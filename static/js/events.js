import {
  cleanPromptsBtn,
  inputBusqueda,
  btnLimpiarBusqueda,
  listaHistorial,
  btnPrev,
  btnNext,
  textoResultado,
} from "./selectors.js";

import {
  paginaActual,
  setBusquedaActual,
  setIdEnEdicion
} from "./state.js";

import { cargarHistorial } from "./historial.js";
import { resetearFormulario, copiarAlPortapapeles } from "./form.js";
import { abrirModal } from "./modal.js";
import { getUsuarioLogueado } from './auth.js';

cleanPromptsBtn?.addEventListener("click", () => {
  resetearFormulario();
});

inputBusqueda?.addEventListener("input", (e) => {
  setBusquedaActual(e.target.value);
  cargarHistorial(1);
});

btnLimpiarBusqueda?.addEventListener("click", () => {
  inputBusqueda.value = "";
  setBusquedaActual("");
  resetearFormulario();
  cargarHistorial(1);
});

btnPrev?.addEventListener("click", () => {
  if (paginaActual > 1) cargarHistorial(paginaActual - 1);
});

btnNext?.addEventListener("click", () => {
  cargarHistorial(paginaActual + 1);
});

listaHistorial?.addEventListener("click", async (e) => {
  const usuario = getUsuarioLogueado();
  if (!usuario) return;

  const btn = (cls) => e.target.closest(cls);

  if (btn(".btn-eliminar-prompt")) {
    const id = btn(".btn-eliminar-prompt").dataset.id;
    abrirModal({
      titulo: "¿Eliminar?",
      mensaje: "Esto borrará el registro permanentemente.",
      esConfirmacion: true,
      alConfirmar: async () => {
        await fetch(`/delete-prompt/${id}?user_id=${usuario.id}`, { method: "DELETE" });
        cargarHistorial(1);
      },
    });
  }

  if (btn(".btn-cargar-prompt")) {
    resetearFormulario();
    document.getElementById("user_input").value =
      btn(".btn-cargar-prompt").dataset.promptInicial; 
    document.getElementById("contenedor-resultado").style.display = "block";
    document.getElementById("texto-resultado").innerText = btn(".btn-cargar-prompt").dataset.promptMejorado; ;
  }

  if (btn(".btn-copy-original")) {
    copiarAlPortapapeles(
      btn(".btn-copy-original").dataset.promptCompleto,
    );
  }

  if (btn(".btn-editar")) {
    document.getElementById("user_input").value =
      btn(".btn-editar").dataset.promptCompleto;
      setIdEnEdicion(btn(".btn-editar").dataset.promptId);
    document.getElementById("contenedor-resultado").style.display = "none";
    document.getElementById("btn-enviar").innerText = "Actualizar Prompt";
  }

  if (btn(".btn-fav")) {
    const id = btn(".btn-fav").dataset.id;
    const isFav = btn(".btn-fav").dataset.fav;

    abrirModal({
      titulo: "Favorito",
      mensaje: `¿Deseas ${isFav === "true" ? "desmarcar" : "marcar"
        } este prompt como favorito?`,
      esConfirmacion: true,
      alConfirmar: async () => {
        await fetch(`/favorite/${id}?user_id=${usuario.id}`);
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