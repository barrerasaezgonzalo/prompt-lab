import { getUsuarioLogueado } from "./auth.js";
import "./state.js";
import "./selectors.js";
import { cargarHistorial } from "./historial.js";
import "./form.js";
import "./modal.js";
import "./events.js";


document.addEventListener("DOMContentLoaded", async () => {
  await getUsuarioLogueado()
  cargarHistorial(1);
});
