1 - Al Generar se resetear el form y se crea una variable inCreation(boolean)
  - si existe la variable (edicion o creacion) se muestra el boton de Actualizar Prompt y Guadar Cambios (no se muestra guardar si noexiste usuario)
  - Interacciones??????
  - cual el usario este contorme tiene la opciones de guardar ( solo esta con usuario y esEdit)  

2 - api/generar: 
      Efectula las valicadiones de esquema mediante schema
      llama a save_prompt_id y este devuelve solo el prompt mejorado (no guarda nada en DB)

  -  api/insert_db     (la misma para crear y editar)
      guarda todos los datos generadosp or el usuario

3 - Main.js se encargara de importar todos los js y efecetuar la primera llamada a cargarHistorial

4 - Auth.sj se encargara de la authenticacion con google //Debt Tech JWT

5 - state.js tendra las variables globales 

6 - historial.js se encargar de poblar la informacion de todos los registrados del historial

7 - Form,ts se encarga de manjear la logisca el envio del formulario (para los 2 casos)

8 - modal.ts sera el encargado de presentar los feeback al usuario //Debt Text UI

9 - events.ts sera el encargado de manjearl los ventos de las acciones

10 - Se eliminar Cargar y Editar y se deja solo Refinar en el historial



  

      
