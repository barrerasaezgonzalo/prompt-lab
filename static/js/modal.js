// Variable global del módulo para controlar el auto-cierre
let toastTimer = null;

/**
 * Muestra una notificación tipo Toast o un diálogo de confirmación.
 * @param {string} title - Título del mensaje.
 * @param {string} message - Cuerpo del mensaje.
 * @param {string} type - 'success' | 'error' | 'info' | 'warning'
 * @param {boolean} confirmable - Si es true, muestra botones y no se cierra solo.
 * @param {function} onConfirm - Función a ejecutar si el usuario confirma.
 * @param {function} onCancel - Función opcional si el usuario cancela.
 */
export function showToast({ 
    title, 
    message, 
    type = 'info', 
    confirmable = false, 
    onConfirm = null, 
    onCancel = null 
}) {
    const container = document.getElementById("modal-container");
    const modalBox = container.querySelector('div'); // El recuadro del toast
    const titleEl = document.getElementById("modal-title");
    const messageEl = document.getElementById("modal-message");
    const actionBtn = document.getElementById("modal-action-btn");
    const cancelBtn = document.getElementById("modal-cancel-btn");
    const footer = document.getElementById("modal-footer"); // Asegúrate que este ID exista en tu HTML

    // 1. Limpiar cualquier timer activo
    if (toastTimer) clearTimeout(toastTimer);

    // 2. Definir Colores de Borde y Título según el tipo
    const theme = {
        success: { border: 'border-emerald-500', text: 'text-emerald-400' },
        error:   { border: 'border-red-500',     text: 'text-red-400' },
        warning: { border: 'border-amber-500',   text: 'text-amber-400' },
        info:    { border: 'border-blue-500',    text: 'text-blue-400' }
    };

    const currentTheme = theme[type] || theme.info;

    // 3. Aplicar Estilos y Contenido
    // Limpiamos clases viejas y ponemos las nuevas
    modalBox.className = `bg-zinc-900 border ${currentTheme.border} rounded-xl p-4 w-80 shadow-2xl pointer-events-auto transform transition-all`;
    titleEl.className = `text-sm font-bold ${currentTheme.text}`;
    
    titleEl.innerText = title;
    messageEl.innerText = message;

    // 4. Configurar Botones (Eliminar listeners viejos con cloneNode)
    if (confirmable) {
        footer.classList.remove("hidden");
        
        // Clonar para limpiar eventos previos
        const newActionBtn = actionBtn.cloneNode(true);
        const newCancelBtn = cancelBtn.cloneNode(true);
        actionBtn.parentNode.replaceChild(newActionBtn, actionBtn);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

        newActionBtn.addEventListener('click', () => {
            if (onConfirm) onConfirm();
            closeToast();
        });

        newCancelBtn.addEventListener('click', () => {
            if (onCancel) onCancel();
            closeToast();
        });
    } else {
        footer.classList.add("hidden");
        // Si no es confirmable, auto-cerrar en 4 segundos
        toastTimer = setTimeout(closeToast, 4000);
    }

    // 5. Mostrar con animación
    container.classList.remove("hidden");
    container.classList.add("toast-animate-in");
}

export function closeToast() {
    const container = document.getElementById("modal-container");
    container.classList.add("hidden");
    container.classList.remove("toast-animate-in");
    if (toastTimer) clearTimeout(toastTimer);
}