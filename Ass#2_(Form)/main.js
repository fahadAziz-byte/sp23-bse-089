
document.getElementById('form').onsubmit = function(event) {
    var name = document.getElementById('name');
    var email = document.getElementById('email');
    var city = document.getElementById('city');
    var span = document.getElementById('span');
    
    span.textContent = '';
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (name.value.length < 4) {
        span.textContent = '--- Length of Name is too short ---';
    }
    else if (!emailRegex.test(email.value)) {
        span.textContent = '--- Email is invalid ---';
    }
    else if (city.value.length < 4) {
        span.textContent = '--- Length of City is too short ---';
    } else {
        span.style.color='Green';
        span.textContent = 'Form submitted successfully!';
        alert("Form submitted successfully!");
        event.preventDefault();
    }
    event.preventDefault();
}

    
