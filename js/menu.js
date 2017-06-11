let menuVisible = false;
var menuButton = document.getElementById('menu-button');

menuButton.addEventListener('click', toggleMenuState)

function toggleMenuState () {
    menuVisible = !menuVisible;
    if (menuVisible) {
        document.body.classList.add('menu-visible');
    } else {
        document.body.classList.remove('menu-visible');
    }
}