import {
  clearPromptsBtn,
  searchInput,
  cleanSearchBtn,
  historyList,
  paginationPrevBtn,
  paginationNextBtn,
  resultText,
  newPromptBtn,
} from "./selectors.js";

import {
  paginaActual,
  setBusquedaActual,
  setIdEnEdicion,
  setCurrentDraft,
  soloFavoritos,
  setSoloFavoritos,
} from "./state.js";

import { cargarHistorial } from "./historial.js";
import { resetearFormulario, copiarAlPortapapeles } from "./form.js";
import { showToast } from "./modal.js";
import { getUsuarioLogueado } from "./auth.js";

newPromptBtn?.addEventListener("click", () => {
  resetearFormulario();
});

clearPromptsBtn?.addEventListener("click", () => {
  showToast({
    title: "Limpiar",
    message: `¿Deseas limpiar este prompt?`,
    type: "warning",
    confirmable: true,
    onConfirm: async () => {
      resetearFormulario();
    },
  });
});

searchInput?.addEventListener("input", (e) => {
  setBusquedaActual(e.target.value);
  cargarHistorial(1);
});

cleanSearchBtn?.addEventListener("click", () => {
  searchInput.value = "";
  setBusquedaActual("");
  cargarHistorial(1);
});

paginationPrevBtn?.addEventListener("click", () => {
  if (paginaActual > 1) cargarHistorial(paginaActual - 1);
});

paginationNextBtn?.addEventListener("click", () => {
  cargarHistorial(paginaActual + 1);
});

const btnFiltroFav = document.getElementById("btn-filtro-fav");
const iconFavFilter = document.getElementById("icon-fav-filter");
btnFiltroFav.addEventListener("click", () => {
  setSoloFavoritos(!soloFavoritos);

  if (soloFavoritos) {
    iconFavFilter.classList.remove("text-gray-400");
    iconFavFilter.classList.add("text-yellow-500", "fill-current");
  } else {
    iconFavFilter.classList.add("text-gray-400");
    iconFavFilter.classList.remove("text-yellow-500", "fill-current");
  }

  cargarHistorial(1);
});

historyList?.addEventListener("click", async (e) => {
  const usuario = getUsuarioLogueado();
  if (!usuario) return;

  const btn = (cls) => e.target.closest(cls);

  if (btn(".btn-eliminar-prompt")) {
    const id = btn(".btn-eliminar-prompt").dataset.id;

    showToast({
      title: "¿Eliminar",
      message: `¿Deseas eliminar este prompt?`,
      type: "warning",
      confirmable: true,
      onConfirm: async () => {
        await fetch(`/delete-prompt/${id}?user_id=${usuario.id}`, {
          method: "DELETE",
        });
        cargarHistorial(1);
      },
    });
  }

  if (btn(".btn-refinar")) {
    resetearFormulario();
    setIdEnEdicion(btn(".btn-refinar").dataset.promptId);
    document.getElementById("user_input").value =
      btn(".btn-refinar").dataset.promptInicial;
    document.getElementById("save-btn").style.display = "block";
    document.getElementById("result-container").style.display = "block";
    document.getElementById("result-text").innerText =
      btn(".btn-refinar").dataset.promptMejorado;
    setCurrentDraft(btn(".btn-refinar").dataset.promptMejorado);
  }

  if (btn(".btn-view")) {
    resetearFormulario();
    //setIdEnEdicion(btn(".btn-view").dataset.promptId);
    document.getElementById("user_input").value =
      btn(".btn-view").dataset.promptInicial;
    document.getElementById("save-btn").style.display = "none";
    document.getElementById("generate-btn").style.display = "none";
    document.getElementById("clear-prompts-btn").style.display = "none";
    document.getElementById("result-container").style.display = "block";
    document.getElementById("result-text").innerText =
      btn(".btn-view").dataset.promptMejorado;
    //setCurrentDraft(btn(".btn-refinar").dataset.promptMejorado);
  }

  // if (btn(".btn-cargar-prompt")) {
  //   resetearFormulario();
  //   document.getElementById("user_input").value =
  //     btn(".btn-cargar-prompt").dataset.promptInicial;
  //   document.getElementById("result-container").style.display = "block";
  //   document.getElementById("result-text").innerText = btn(".btn-cargar-prompt").dataset.promptMejorado; ;
  // }

  if (btn(".btn-copy-original")) {
    copiarAlPortapapeles(btn(".btn-copy-original").dataset.promptCompleto);
  }

  // if (btn(".btn-editar")) {
  //   document.getElementById("user_input").value =
  //     btn(".btn-editar").dataset.promptCompleto;
  //     setIdEnEdicion(btn(".btn-editar").dataset.promptId);
  //   document.getElementById("result-container").style.display = "none";
  //   document.getElementById("generate-btn").innerText = "Actualizar Prompt";
  // }

  if (btn(".btn-fav")) {
    const id = btn(".btn-fav").dataset.id;
    const isFav = btn(".btn-fav").dataset.fav;

    showToast({
      title: "Favorito",
      message: `¿Deseas ${
        isFav === "true" ? "desmarcar" : "marcar"
      } este prompt como favorito?`,
      type: "warning",
      confirmable: true,
      onConfirm: async () => {
        await fetch(`/favorite/${id}?user_id=${usuario.id}`);
        cargarHistorial(paginaActual);
      },
    });
  }
});

document
  .getElementById("btn-copiar-resultado")
  ?.addEventListener("click", () => {
    copiarAlPortapapeles(resultText.innerText);
  });
