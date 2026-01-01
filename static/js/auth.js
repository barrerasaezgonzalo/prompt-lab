const SUPABASE_URL = "https://gibxykoiwscbkccafdye.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpYnh5a29pd3NjYmtjY2FmZHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMDUyNjQsImV4cCI6MjA3NTY4MTI2NH0.1BXDuJeztxADnGik_kWqU_K-RtGjfWXlf1rMduVY76c";

// Creamos la conexión
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let usuarioLogueado = null;

supabaseClient.auth.onAuthStateChange((event, session) => {
  usuarioLogueado = session?.user || null;

  const btnLogin = document.getElementById("btn-login");
  const btnLogout = document.getElementById("btn-logout");

  if (usuarioLogueado) {
    // --- USUARIO CONECTADO ---
    if (btnLogin) btnLogin.classList.add("hidden");
    if (btnLogout) btnLogout.classList.remove("hidden");
    const aviso = document.getElementById("aviso-invitado");
    aviso.classList.add("hidden");
    cargarHistorial(1);
  } else {
    // --- USUARIO DESCONECTADO ---
    if (btnLogin) btnLogin.classList.remove("hidden");
    if (btnLogout) btnLogout.classList.add("hidden");

    const aviso = document.getElementById("aviso-invitado");
    aviso.classList.remove("hidden");

    const lista = document.getElementById("lista-historial");
    if (lista) lista.innerHTML = "";

    const paginacion = document.getElementById("controles-paginacion");
    if (paginacion) paginacion.classList.add("hidden");

    const historial = document.getElementById("historial");
    if (historial) historial.classList.add("hidden");
  }
});

async function cerrarSesion() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) console.error("Error al salir:", error.message);
  // Al salir, el evento onAuthStateChange se disparará automáticamente
}

async function loginConGoogle() {
  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: "google",
    options: {
      // Esto asegura que Google lo regrese a tu web actual
      redirectTo: window.location.origin,
    },
  });

  if (error) {
    console.error("Error al iniciar sesión:", error.message);
    abrirModal({ titulo: "Error", mensaje: "No se pudo conectar con Google." });
  }
}

document.getElementById("btn-logout")?.addEventListener("click", cerrarSesion);
document.getElementById("btn-login")?.addEventListener("click", loginConGoogle);
