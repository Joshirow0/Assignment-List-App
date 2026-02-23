import { form, input, lista, btnBorrarCompletadas, contenedorFiltros, renderizarTareas } from './Dom.js';
import { tareas, filtroActual, agregarTarea, eliminarTarea, toggleCompletada, borrarCompletadas, setFiltro, editarTextoTarea } from './ListManagement.js';

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

lista.addEventListener('dblclick', function(e) {

    const spanTexto = e.target.closest('.texto-tarea');
    if (!spanTexto) return; // If the double-click wasn't on a task text, ignore it.

    const elementoLi = spanTexto.closest('.card');
    const idTarea = Number(elementoLi.dataset.id);
    const textoActual = spanTexto.textContent;

    const inputEdicion = document.createElement('input');
    inputEdicion.type = 'text';
    inputEdicion.value = textoActual;
    inputEdicion.className = 'form__input';
    inputEdicion.style.flex = "1";

    spanTexto.replaceWith(inputEdicion);
    
    inputEdicion.focus();
    
    function guardarEdicion() {
        const nuevoTexto = inputEdicion.value.trim();
        if (nuevoTexto !== '') {
            editarTextoTarea(idTarea, nuevoTexto);
        }
        renderizarTareas(tareas, filtroActual);
    }

    inputEdicion.addEventListener('blur', guardarEdicion);

    inputEdicion.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            guardarEdicion();
        }
        if (e.key === 'Escape') {
            renderizarTareas(tareas, filtroActual);
        }
    });
});