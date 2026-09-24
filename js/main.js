// HELP GAME — interações de UI
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }
  // Marca o link ativo do menu superior conforme a página atual
  const current = window.location.pathname.split('/').pop() || 'index.html';
  const activePage = current === 'tutorial.html' ? 'tutoriais.html' : current;
  document.querySelectorAll('.main-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === activePage) a.classList.add('active');
  });
  document.querySelectorAll('.side-rail a').forEach(a => {
    const href = a.getAttribute('href').split('#')[0];
    if (href === activePage) a.classList.add('active');
  });
});

