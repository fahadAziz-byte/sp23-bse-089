console.log('Script is loaded'); // Check if the script is linked correctly

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded'); // Confirm this is triggered
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('priceFilterForm');
    if (form) {
        form.addEventListener('submit', async (event) => {
            console.log('hello');
            event.preventDefault();
            console.log('Form submission prevented'); 

            const formData = new FormData(event.target);
            const selectedRanges = formData.getAll('priceRange');
            console.log(selectedRanges);

            try {
                const response = await fetch('/filterProducts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ priceRanges: selectedRanges }),
                });

                const products = await response.json();
                console.log(products);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        });
    } else {
        console.error('Form not found in the DOM');
    }
});