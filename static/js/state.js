export let paginaActual = 1;
export let totalPaginas = 1;
export let busquedaActual = "";
export let idEnEdicion = null;
export let inCreation = false;
export let currentDraft = "";
export let soloFavoritos = false;

export const setPaginaActual = (v) => (paginaActual = v);
export const setTotalPaginas = (v) => (totalPaginas = v);
export const setBusquedaActual = (v) => (busquedaActual = v);
export const setIdEnEdicion = (v) => (idEnEdicion = v);
export const setInCreation = (v) => (inCreation = v);
export function setCurrentDraft(val) {
  currentDraft = val;
}
export function setSoloFavoritos(val) {
  soloFavoritos = val;
}
