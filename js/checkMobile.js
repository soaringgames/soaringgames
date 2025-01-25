function isMobile() {
    return window.innerWidth <= 992;
}

document.addEventListener("DOMContentLoaded", function() {
    if (isMobile()) {
        // Hide the game and show the form
        document.getElementById('myCanvas').style.display = 'none';
        document.getElementById('signup').style.display = '';
    } else {
        // Show the game and hide the form
        document.getElementById('myCanvas').style.display = 'block';
        document.getElementById('reveal').style.display = '';
    }
});