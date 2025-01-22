function isMobile() {
    return window.innerWidth <= 768;
}

document.addEventListener("DOMContentLoaded", function() {
    if (isMobile()) {
        // Hide the game and show the form
        document.getElementById('myCanvas').style.display = 'none';
        document.getElementById('signup').style.height = 'auto';
        document.getElementById('signup').style.overflow = 'visible';
        document.getElementById('signup').style.padding = '10rem 0';
        document.getElementById('click').textContent = 'this button does nothing';
    } else {
        // Show the game and hide the form
        document.getElementById('myCanvas').style.display = 'block';
        document.getElementById('signup').style.height = '0';
        document.getElementById('signup').style.overflow = 'hidden';
    }
});