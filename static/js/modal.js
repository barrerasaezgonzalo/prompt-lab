import {
  modal,
  modalTitulo,
  modalMensaje,
} from "./selectors.js";

export function abrirModal({
  titulo,
  mensaje,
  esConfirmacion = false,
  alConfirmar = null,
  textoConfirmar = "Confirmar",
}) {
  modalTitulo.innerText = titulo;
  modalMensaje.innerText = mensaje;

  const btnAccion = modal.querySelector("#btn-accion");
  const btnSecundario = modal.querySelector("#btn-secundario");

  const nuevoBtnAccion = btnAccion.cloneNode(true);
  const nuevoBtnSecundario = btnSecundario.cloneNode(true);
  btnAccion.replaceWith(nuevoBtnAccion);
  btnSecundario.replaceWith(nuevoBtnSecundario);

  if (esConfirmacion) {
    nuevoBtnAccion.innerText = textoConfirmar;
    nuevoBtnAccion.classList.remove("hidden");
    nuevoBtnAccion.onclick = async () => {
      await alConfirmar?.();
      cerrarModal();
    };
    nuevoBtnSecundario.innerText = "Cancelar";
  } else {
    nuevoBtnAccion.classList.add("hidden");
    nuevoBtnSecundario.innerText = "Entendido";
  }
  nuevoBtnSecundario.addEventListener("click", () => {
    cerrarModal();
  });

  modal.classList.remove("hidden");
}

export function cerrarModal() {
  const m = document.getElementById("modal-container");
  m.classList.add("hidden");
}

