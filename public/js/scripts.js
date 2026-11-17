document.addEventListener('DOMContentLoaded', () => {
    const selectedSizesInput = document.getElementById('selected-sizes');
    const selectedSizesDisplay = document.getElementById('mostrar-talla');
    const sizeButtons = document.querySelectorAll('.btn-talla');

    if (!selectedSizesInput || sizeButtons.length === 0) {
        return;
    }

    // Load initial sizes when editing an existing shoe (e.g., "38,40,42")
    const selectedSizes = new Set(
        selectedSizesInput.value
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s !== '')
    );

    function syncSizesUI() {
        const sorted = Array.from(selectedSizes).sort((a, b) => Number(a) - Number(b));
        const textValue = sorted.join(',');
        selectedSizesInput.value = textValue;
        if (selectedSizesDisplay) {
            selectedSizesDisplay.textContent = textValue;
        }
    }

    // Highlight pre-selected buttons on load and attach click listeners
    sizeButtons.forEach((button) => {
        const size = button.getAttribute('data-talla');
        if (selectedSizes.has(size)) {
            button.classList.add('active', 'talla-seleccionada');
        }

        button.addEventListener('click', () => {
            if (selectedSizes.has(size)) {
                selectedSizes.delete(size);
                button.classList.remove('active', 'talla-seleccionada');
            } else {
                selectedSizes.add(size);
                button.classList.add('active', 'talla-seleccionada');
            }
            syncSizesUI();
        });
    });

    syncSizesUI();
});