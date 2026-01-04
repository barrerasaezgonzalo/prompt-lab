export let paginaActual = 1;
export let totalPaginas = 1;
export let busquedaActual = "";
export let idEnEdicion = null;

export const setPaginaActual = (v) => (paginaActual = v);
export const setTotalPaginas = (v) => (totalPaginas = v);
export const setBusquedaActual = (v) => (busquedaActual = v);
export const setIdEnEdicion = (v) => (idEnEdicion = v);