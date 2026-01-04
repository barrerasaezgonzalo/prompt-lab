// auth.js
import { abrirModal } from "./modal.js";
import { cargarHistorial } from "./historial.js";

const SUPABASE_URL = "https://gibxykoiwscbkccafdye.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpYnh5a29pd3NjYmtjY2FmZHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMDUyNjQsImV4cCI6MjA3NTY4MTI2NH0.1BXDuJeztxADnGik_kWqU_K-RtGjfWXlf1rMduVY76c";

export const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
);

let usuarioLogueado = null;
export function getUsuarioLogueado() {
  return usuarioLogueado;
}

supabaseClient.auth.onAuthStateChange((event, session) => {
  usuarioLogueado = session?.user || null; 

  const btnLogin = document.getElementById("btn-login");
  const btnLogout = document.getElementById("btn-logout");
  const aviso = document.getElementById("aviso-invitado");
  const lista = document.getElementById("lista-historial");
  const paginacion = document.getElementById("controles-paginacion");
  const historial = document.getElementById("historial");

  if (usuarioLogueado) {
    btnLogin?.classList.add("hidden");
    btnLogout?.classList.remove("hidden");
    aviso?.classList.add("hidden");
    paginacion?.classList.remove("hidden");
    historial?.classList.remove("hidden");
    cargarHistorial(1);
  } else {
    btnLogin?.classList.remove("hidden");
    btnLogout?.classList.add("hidden");
    aviso?.classList.remove("hidden");
    lista && (lista.innerHTML = "");
    paginacion?.classList.add("hidden");
    historial?.classList.add("hidden");
  }
});

export async function cerrarSesion() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) console.error("Error al salir:", error.message);
}

export async function loginConGoogle() {
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin },
  });

  if (error) {
    abrirModal({
      titulo: "Error",
      mensaje: "No se pudo conectar con Google.",
    });
  }
}

document.getElementById("btn-logout")?.addEventListener("click", cerrarSesion);
document.getElementById("btn-login")?.addEventListener("click", loginConGoogle);
