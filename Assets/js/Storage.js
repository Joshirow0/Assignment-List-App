export function guardarEnStorage(tareas) {
    localStorage.setItem('mis_tareas', JSON.stringify(tareas));  // Saved in JSON format to preserve the array structure.
}

export function cargarDeStorage() {
    const tareasGuardadas = localStorage.getItem('mis_tareas');
    return tareasGuardadas ? JSON.parse(tareasGuardadas) : [];  // If there are saved tasks, parse and return them; otherwise, return an empty array.
}