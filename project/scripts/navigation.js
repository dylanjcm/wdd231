const hamb = document.getElementById('hamburger');
const menu = document.getElementById('primary-menu');

if (hamb && menu) {
  hamb.addEventListener('click', () => {
    const expanded = hamb.getAttribute('aria-expanded') === 'true';
    hamb.setAttribute('aria-expanded', String(!expanded));

    menu.classList.toggle('open');

    hamb.textContent = expanded ? "☰" : "✖";
  });

  menu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      hamb.setAttribute('aria-expanded', 'false');
      hamb.textContent = "☰";
    })
  );
}
