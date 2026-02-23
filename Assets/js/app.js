import { form, input, lista, btnBorrarCompletadas, contenedorFiltros, renderizarTareas } from './Dom.js';
import { tareas, filtroActual, agregarTarea, eliminarTarea, toggleCompletada, borrarCompletadas, setFiltro, editarTextoTarea, actualizarOrdenTareas } from './ListManagement.js';

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

lista.addEventListener('dragstart', e => {
    // Solo permitimos arrastrar si estamos viendo "Todas" las tareas
    if (filtroActual !== 'todas') {
        e.preventDefault();
        alert("Solo puedes reordenar tareas cuando el filtro está en 'Todas'.");
        return;
    }

    const tarjeta = e.target.closest('.card--draggable');
    if (tarjeta) {
        tarjeta.classList.add('is-dragging');
    }
});

lista.addEventListener('dragend', e => {
    const tarjeta = e.target.closest('.card--draggable');
    if (tarjeta) {
        tarjeta.classList.remove('is-dragging');
        
        // ¡Magia! Leemos el nuevo orden del DOM y actualizamos los datos
        const todosLosElementos = [...lista.querySelectorAll('.card')];
        const nuevosIds = todosLosElementos.map(el => el.dataset.id);
        
        actualizarOrdenTareas(nuevosIds);
        renderizarTareas(tareas, filtroActual); // Redibujamos para asegurar consistencia
    }
});

lista.addEventListener('dragover', e => {
    e.preventDefault(); // OBLIGATORIO para que HTML5 nos deje soltar el elemento
    
    const tarjetaArrastrada = document.querySelector('.is-dragging');
    if (!tarjetaArrastrada) return;

    // Calculamos debajo de qué elemento debemos colocar la tarjeta
    const elementoPosterior = obtenerElementoPosterior(lista, e.clientY);
    
    if (elementoPosterior == null) {
        // Si no hay elemento debajo, lo mandamos al final
        lista.appendChild(tarjetaArrastrada);
    } else {
        // Si hay elemento debajo, lo insertamos justo antes de él
        lista.insertBefore(tarjetaArrastrada, elementoPosterior);
    }
});

function obtenerElementoPosterior(contenedor, y) {
    // Agarramos todas las tarjetas que NO estamos arrastrando
    const elementosArrastrables = [...contenedor.querySelectorAll('.card:not(.is-dragging)')];

    return elementosArrastrables.reduce((masCercano, hijo) => {
        const caja = hijo.getBoundingClientRect();
        // Calculamos el centro vertical de cada tarjeta
        const offset = y - caja.top - caja.height / 2;
        
        // Si el ratón está por encima del centro de la tarjeta...
        if (offset < 0 && offset > masCercano.offset) {
            return { offset: offset, element: hijo };
        } else {
            return masCercano;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}