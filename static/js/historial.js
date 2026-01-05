import {
  historyList,
  historyTemplate,
  paginationPrevBtn,
  paginationNextBtn,
  paginationInfo,
} from "./selectors.js";

import {
  paginaActual,
  totalPaginas,
  busquedaActual,
  setPaginaActual,
  setTotalPaginas,
  soloFavoritos, 
} from "./state.js";

import { getUsuarioLogueado } from './auth.js';

export async function cargarHistorial(pagina = 1) {
  const usuario = getUsuarioLogueado();

  if (!usuario) return;

  setPaginaActual(pagina);

  const url = `/get-history?page=${pagina}&search=${encodeURIComponent(
    busquedaActual,
  )}&user_id=${usuario.id}&only_favs=${soloFavoritos}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    historyList.innerHTML = "";
    setTotalPaginas(data.total_paginas);

    data.history.forEach((item) => {
      const clone = historyTemplate.content.cloneNode(true);

      clone.querySelector(".prompt-texto-li").textContent =
        item.prompt_original;

      // const btnCargar = clone.querySelector(".btn-cargar-prompt");
      // if (btnCargar) {
      //   btnCargar.setAttribute("data-prompt-inicial", item.prompt_original);
      //   btnCargar.setAttribute("data-prompt-mejorado", item.prompt_mejorado);
      // }

      clone
        .querySelector(".btn-eliminar-prompt")
        ?.setAttribute("data-id", item.id);

      clone.querySelector(".btn-copy-original")?.setAttribute(
        "data-prompt-completo",
        `--- PROMPT ORIGINAL ---\n${item.prompt_original}\n--- PROMPT MEJORADO ---\n${item.prompt_mejorado}`,
      );

      const btnRefinar = clone.querySelector(".btn-refinar");
      if (btnRefinar) {
        btnRefinar.setAttribute("data-prompt-inicial", item.prompt_original);
        btnRefinar.setAttribute("data-prompt-mejorado", item.prompt_mejorado);
        btnRefinar.setAttribute("data-prompt-id", item.id)
      }

      const viewBtn = clone.querySelector(".btn-view");
      if (viewBtn) {
        viewBtn.setAttribute("data-prompt-inicial", item.prompt_original);
        viewBtn.setAttribute("data-prompt-mejorado", item.prompt_mejorado);
        viewBtn.setAttribute("data-prompt-id", item.id)
      }

      const btnFav = clone.querySelector(".btn-fav");
      if (btnFav) {
        btnFav.setAttribute("data-id", item.id);
        btnFav.setAttribute("data-fav", item.is_favorite);
        const svg = btnFav.querySelector("svg");
        svg?.setAttribute(
          "fill",
          item.is_favorite ? "currentColor" : "none",
        );
        btnFav.classList.toggle("text-red-500", item.is_favorite);
      }

      historyList.appendChild(clone);
    });

    actualizarUI();
  } catch (e) {
    console.error("Error al cargar historial", e);
  }
}

function actualizarUI() {
  paginationInfo.textContent = `Página ${paginaActual} de ${totalPaginas}`;

  paginationPrevBtn.disabled = paginaActual <= 1;
  paginationNextBtn.disabled = paginaActual >= totalPaginas;

  paginationPrevBtn.classList.toggle("opacity-30", paginationPrevBtn.disabled);
  paginationNextBtn.classList.toggle("opacity-30", paginationNextBtn.disabled);
}
