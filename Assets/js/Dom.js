export const form = document.getElementById('formulario-tareas');
export const input = document.getElementById('input-tarea');
export const lista = document.getElementById('lista-tareas');
export const contador = document.getElementById('contador-tareas');
export const btnBorrarCompletadas = document.getElementById('btn-borrar-completadas');
export const contenedorFiltros = document.getElementById('filtros');

export function renderizarTareas(arregloTareas, filtro) {
    lista.innerHTML = '';

    // Filtramos localmente solo para dibujar
    let tareasFiltradas = arregloTareas;
    if (filtro === 'pendientes') {
        tareasFiltradas = arregloTareas.filter(t => !t.completada);
    } else if (filtro === 'completadas') {
        tareasFiltradas = arregloTareas.filter(t => t.completada);
    }

    tareasFiltradas.forEach(tarea => {
        const li = document.createElement('li');
        li.className = 'card card--horizontal card--transparent card--draggable';
        if (tarea.completada) li.classList.add('card--muted');

        li.setAttribute('data-id', tarea.id);
        li.setAttribute('draggable', 'true');

        li.innerHTML = `
            <div class="card__body body--row">
                <input type="checkbox" class="form__checkbox checkbox--m" ${tarea.completada ? 'checked' : ''}>
                <span class="card__text ${tarea.completada ? 'text--muted' : ''} texto-tarea">${tarea.texto}</span>
            </div>
            <button class="btn btn--icon" aria-label="Eliminar tarea">🗑️</button>
        `;
        lista.appendChild(li);
    });

    actualizarContador(arregloTareas);
}

function actualizarContador(arregloTareas) {
    const pendientes = arregloTareas.filter(t => !t.completada).length;
    const texto = pendientes === 1 ? 'tarea pendiente' : 'tareas pendientes';
    contador.textContent = `${pendientes} ${texto}`;
}