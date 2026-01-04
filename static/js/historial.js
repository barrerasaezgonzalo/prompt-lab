import {
  listaHistorial,
  templateHistorial,
  btnPrev,
  btnNext,
  spanInfo,
} from "./selectors.js";

import {
  paginaActual,
  totalPaginas,
  busquedaActual,
  setPaginaActual,
  setTotalPaginas,
} from "./state.js";

import { getUsuarioLogueado } from './auth.js';

import { abrirModal } from "./modal.js";

export async function cargarHistorial(pagina = 1) {
  const usuario = getUsuarioLogueado();

  if (!usuario) return;

  setPaginaActual(pagina);

  const url = `/get-history?page=${pagina}&search=${encodeURIComponent(
    busquedaActual,
  )}&user_id=${usuario.id}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    listaHistorial.innerHTML = "";
    setTotalPaginas(data.total_paginas);

    data.history.forEach((item) => {
      const clone = templateHistorial.content.cloneNode(true);

      clone.querySelector(".prompt-texto-li").textContent =
        item.prompt_original;

      const btnCargar = clone.querySelector(".btn-cargar-prompt");
      if (btnCargar) {
        btnCargar.setAttribute("data-prompt-inicial", item.prompt_original);
        btnCargar.setAttribute("data-prompt-mejorado", item.prompt_mejorado);
      }

      clone
        .querySelector(".btn-eliminar-prompt")
        ?.setAttribute("data-id", item.id);

      clone.querySelector(".btn-copy-original")?.setAttribute(
        "data-prompt-completo",
        `--- PROMPT ORIGINAL ---\n${item.prompt_original}\n--- PROMPT MEJORADO ---\n${item.prompt_mejorado}`,
      );

      const btnEditar = clone.querySelector(".btn-editar");
      if (btnEditar) {
        btnEditar.setAttribute("data-prompt-completo", item.prompt_original);
        btnEditar.setAttribute("data-prompt-id", item.id);
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

      listaHistorial.appendChild(clone);
    });

    actualizarUI();
  } catch (e) {
    console.error("Error al cargar historial", e);
  }
}

function actualizarUI() {
  spanInfo.textContent = `Página ${paginaActual} de ${totalPaginas}`;

  btnPrev.disabled = paginaActual <= 1;
  btnNext.disabled = paginaActual >= totalPaginas;

  btnPrev.classList.toggle("opacity-30", btnPrev.disabled);
  btnNext.classList.toggle("opacity-30", btnNext.disabled);
}
