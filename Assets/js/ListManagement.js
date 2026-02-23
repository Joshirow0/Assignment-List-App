import { guardarEnStorage, cargarDeStorage } from './Storage.js';

export let tareas = cargarDeStorage();
export let filtroActual = 'todas';

export function agregarTarea(texto) {
    const nuevaTarea = { id: Date.now(), texto: texto, completada: false };
    tareas.push(nuevaTarea);
    guardarEnStorage(tareas);
}

export function eliminarTarea(id) {
    tareas = tareas.filter(tarea => tarea.id !== id);
    guardarEnStorage(tareas);
}

export function toggleCompletada(id) {
    tareas = tareas.map(tarea => {
        if (tarea.id === id) return { ...tarea, completada: !tarea.completada };
        return tarea;
    });
    guardarEnStorage(tareas);
}

export function borrarCompletadas() {
    tareas = tareas.filter(tarea => !tarea.completada);
    guardarEnStorage(tareas);
}

export function setFiltro(nuevoFiltro) {
    filtroActual = nuevoFiltro;
}

export function editarTextoTarea(id, nuevoTexto) {
    tareas = tareas.map(tarea => {
        if (tarea.id === id) {
            return { ...tarea, texto: nuevoTexto };
        }
        return tarea;
    });
    
    guardarEnStorage(tareas);
}

export function actualizarOrdenTareas(nuevosIds) {
    const tareasReordenadas = [];
    
    nuevosIds.forEach(id => {
        const tareaEncontrada = tareas.find(tarea => tarea.id === Number(id));
        if (tareaEncontrada) {
            tareasReordenadas.push(tareaEncontrada);
        }
    });

    tareas = tareasReordenadas;
    guardarEnStorage(tareas);
}