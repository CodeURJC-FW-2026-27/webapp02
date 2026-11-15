/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project


document.addEventListener('DOMContentLoaded', () => {
    const sizeButtons = document.querySelectorAll('.btn-talla');
    const selectedSizesInput = document.getElementById('talla-seleccionada');
    const selectedSizesText = document.getElementById('mostrar-talla');

    if (!selectedSizesInput || !selectedSizesText) return;

    const initialSizes = selectedSizesInput.value
    .split(',')
    .filter(size => size.trim() !== '')
    .map(Number);

    const selectedSizes = new Set(initialSizes);

    sizeButtons.forEach(button => {
        if (selectedSizes.has(Number(button.dataset.talla))) {
         button.classList.add('seleccionada');
        }
    });

selectedSizesText.textContent = initialSizes.length
    ? initialSizes.join(', ')
    : 'Ninguna';

    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const size = Number(button.dataset.talla);

            if (selectedSizes.has(size)) {
                selectedSizes.delete(size);
                button.classList.remove('seleccionada');
            } else {
                selectedSizes.add(size);
                button.classList.add('seleccionada');
            }

            const sizes = [...selectedSizes].sort((a, b) => a - b);

            selectedSizesInput.value = sizes.join(',');
            selectedSizesText.textContent = sizes.length
                ? sizes.join(', ')
                : 'Ninguna';
        });
    });

    const form = selectedSizesInput.closest('form');

    form.addEventListener('submit', event => {
        if (selectedSizes.size === 0) {
            event.preventDefault();
            alert('Selecciona al menos una talla.');
        }
    });

    form.addEventListener('reset', () => {
        selectedSizes.clear();
        sizeButtons.forEach(button => button.classList.remove('btn-success'));
        selectedSizesInput.value = '';
        selectedSizesText.textContent = 'Ninguna';
    });
});

