// HELP GAME — monta a página de detalhe do tutorial a partir de tutorials-data.js
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const slug = TUTORIAL_ORDER.includes(params.get('m')) ? params.get('m') : TUTORIAL_ORDER[0];
  const data = TUTORIALS[slug];
  if (!data) return;
  const tagEl = document.querySelector('.tutorial-head .tag');
  const titleEl = document.querySelector('.tutorial-head h1');
  const introEl = document.querySelector('.tutorial-head .intro');
  const fileEl = document.querySelector('.code-bar .file');
  const codeEl = document.querySelector('.code-panel code');
  const listEl = document.querySelector('.explain ul');
  const switcher = document.querySelector('.tutorial-switch');
  document.title = `${data.title} — Tutoriais · Help Game`;
  if (tagEl) tagEl.textContent = data.tag;
  if (titleEl) titleEl.textContent = data.title;
  if (introEl) introEl.innerHTML = data.intro;
  if (fileEl) fileEl.textContent = data.file;
  if (codeEl) codeEl.innerHTML = data.code;
  if (listEl) {
    listEl.innerHTML = '';
    data.explain.forEach(([term, text]) => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${term}</strong> — ${text}`;
      listEl.appendChild(li);
    });
  }
  if (switcher) {
    switcher.innerHTML = '';
    TUTORIAL_ORDER.forEach(key => {
      const a = document.createElement('a');
      a.href = `tutorial.html?m=${key}`;
      a.textContent = TUTORIALS[key].title;
      if (key === slug) a.classList.add('active');
      switcher.appendChild(a);
    });
  }
});

