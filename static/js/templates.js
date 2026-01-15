export const templates = {
  refactor_pro: {
    icon: "ph-code-block",
    titulo: "Refactorizar",
    prompt: "Actúa como un desarrollador Senior en {{lenguaje}}. Refactoriza el siguiente código siguiendo principios SOLID y Clean Code: \n\n {{codigo}}"
  },
  copy_marketing: {
    icon: "ph-megaphone",
    titulo: "Marketing Copy",
    prompt: "Crea una campaña de anuncios para {{producto}}. El público objetivo es {{audiencia}} y el tono debe ser {{tono}}. Incluye un llamado a la acción potente."
  },
  itinerario_viaje: {
    icon: "ph-airplane-tilt",
    titulo: "Plan de Viaje",
    prompt: "Diseña un itinerario de viaje de {{dias}} días para {{destino}}. Mi presupuesto es {{presupuesto}} y me interesan actividades de tipo {{intereses}}."
  },
  resumen_libro: {
    icon: "ph-book-open",
    titulo: "Resumir Libro",
    prompt: "Resume los 5 puntos clave del libro {{titulo_libro}} de {{autor}}. Enfócate en aplicaciones prácticas para {{area_interes}}."
  },
  traductor_tecnico: {
    icon: "ph-translate",
    titulo: "Traductor Pro",
    prompt: "Traduce el siguiente texto al {{idioma_destino}}, manteniendo el rigor terminológico del área de {{especialidad}}: \n\n {{texto_original}}"
  },
  documentacion_x: {
    icon: "ph-file-text",
    titulo: "Documentación",
    prompt: "Actúa como un Technical Writer. Escribe la documentación técnica para {{nombre_proyecto}}. Incluye secciones de 'Arquitectura', 'Instalación' y 'Ejemplos de uso' basados en esto: {{detalles}}"
  },
  aprender_x: {
    icon: "ph-student",
    titulo: "Hoja de Ruta",
    prompt: "Crea una ruta de aprendizaje (roadmap) detallada para dominar {{tema}}. Mi nivel actual es {{nivel_actual}} y dispongo de {{horas_semanales}} horas a la semana."
  },
  preparar_entrevista: {
    icon: "ph-users-three",
    titulo: "Mock Interview",
    prompt: "Simula una entrevista técnica para el puesto de {{puesto}}. Hazme 5 preguntas desafiantes sobre {{tecnologia}} y evalúa mis respuestas."
  },
  receta_fit: {
    icon: "ph-cooking-pot",
    titulo: "Receta Saludable",
    prompt: "Genera una receta saludable usando solo estos ingredientes: {{ingredientes}}. Excluye {{alergias_o_disgustos}} y calcula macros aproximados."
  }
};

document.addEventListener("click", (e) => {
  const btn = e.target.closest('.template-btn');

  if (btn) {
    const templateId = btn.dataset.id;
    seleccionarPlantilla(templateId);
  }
});

function seleccionarPlantilla(id) {
  const textarea = document.getElementById('user_input');
  const templateData = templates[id];
  if (templateData && textarea) {
    textarea.value = templateData.prompt;
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }, 0);
    const container = document.getElementById('result-container');
    if (container) container.classList.remove('hidden');
  }
}