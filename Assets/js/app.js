import { form, input, lista, btnBorrarCompletadas, contenedorFiltros, renderizarTareas } from './Dom.js';
import { tareas, filtroActual, agregarTarea, eliminarTarea, toggleCompletada, borrarCompletadas, setFiltro } from './ListManagement.js';

renderizarTareas(tareas, filtroActual);

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const texto = input.value.trim();
    if (texto !== '') {
        agregarTarea(texto);
        renderizarTareas(tareas, filtroActual); // Redibujamos después de cada cambio
        input.value = '';
        input.focus();
    }
});

lista.addEventListener('click', function(e) {
    const btnBorrar = e.target.closest('button[aria-label="Eliminar tarea"]');
    const checkbox = e.target.closest('.form__checkbox');
    const elementoLi = e.target.closest('.card');
    
    if (!elementoLi) return;
    const idTarea = Number(elementoLi.dataset.id);

    if (btnBorrar && confirm("¿Eliminar esta tarea?")) {
        eliminarTarea(idTarea);
        renderizarTareas(tareas, filtroActual);
    }

    if (checkbox) {
        toggleCompletada(idTarea);
        renderizarTareas(tareas, filtroActual);
    }
});

contenedorFiltros.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON') {
        const nuevoFiltro = e.target.textContent.toLowerCase().trim();
        setFiltro(nuevoFiltro);
        renderizarTareas(tareas, filtroActual);
    }
});

btnBorrarCompletadas.addEventListener('click', function() {
    borrarCompletadas();
    renderizarTareas(tareas, filtroActual);
});