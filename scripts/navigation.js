const navbutton = document.querySelector('#ham-btn');
const nav = document.querySelector('#nav-bar');

navbutton.addEventListener('click', () => {
    navbutton.classList.toggle('show');
    nav.classList.toggle('show');
});

document.querySelector("#currentyear").textContent = `© ${new Date().getFullYear()} Dylan Calderon - Brazil`;
document.querySelector("#last-modified").textContent = `Last Modified: ${document.lastModified}`;