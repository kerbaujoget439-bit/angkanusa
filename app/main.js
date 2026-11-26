// AngkaNusa — main.js
//
// Boot and router: reads the hash route, renders the matching view from
// views.js into #page, marks the active nav link, then wires the controls
// on that page — chart tabs, "Lihat data" table toggles, and the province
// search/sort on #/daerah. All links are hash routes, so every page works
// from static files with no server-side routing.

import { ROUTES } from './data.js';
import { VIEWS } from './views.js';

const page = document.getElementById('page');
const nav = document.getElementById('nav');

function navHtml(active) {
  return ROUTES.map((r) => `<a href="${r.hash}"${r.hash === active ? ' aria-current="page" class="active"' : ''}>${r.label}</a>`).join('');
}

function wireTableToggles() {
  page.querySelectorAll('[data-table-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const box = document.getElementById(`table-${btn.dataset.tableToggle}`);
      if (!box) return;
      const open = box.hidden;
      box.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Sembunyikan tabel data' : 'Lihat data sebagai tabel';
    });
  });
}

function wireTabs() {
  const tabs = page.querySelectorAll('[data-tab]');
  if (!tabs.length) return;
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
      page.querySelectorAll('[data-panel]').forEach((panel) => {
        panel.hidden = panel.dataset.panel !== tab.dataset.tab;
      });
    });
  });
}

function wireRegionExplorer() {
  const search = document.getElementById('prov-search');
  const sort = document.getElementById('prov-sort');
  const table = document.getElementById('prov-table');
  const count = document.getElementById('prov-count');
  if (!search || !sort || !table) return;
  const tbody = table.querySelector('tbody');
  const original = Array.from(tbody.querySelectorAll('tr'));
  function apply() {
    const q = search.value.trim().toLowerCase();
    let rows = original.filter((tr) => tr.dataset.name.includes(q));
    const mode = sort.value;
    rows = rows.slice().sort((a, b) => {
      if (mode === 'pop-asc') return Number(a.dataset.pop) - Number(b.dataset.pop);
      if (mode === 'name') return a.dataset.name.localeCompare(b.dataset.name, 'id');
      return Number(b.dataset.pop) - Number(a.dataset.pop);
    });
    tbody.replaceChildren(...rows);
    rows.forEach((tr, i) => {
      tr.children[0].textContent = String(i + 1);
    });
    count.textContent = `Menampilkan ${rows.length} dari ${original.length} provinsi.`;
  }
  search.addEventListener('input', apply);
  sort.addEventListener('change', apply);
}

function render() {
  const hash = location.hash || '#/';
  const route = hash.replace(/^#/, '').split('?')[0] || '/';
  const view = VIEWS[route] || VIEWS['/'];
  const active = VIEWS[route] ? `#${route}` : '#/';
  nav.innerHTML = navHtml(active);
  page.innerHTML = view();
  wireTableToggles();
  wireTabs();
  wireRegionExplorer();
  window.scrollTo(0, 0);
  document.title = `AngkaNusa — Statistik Indonesia ${route === '/' ? '' : '· ' + (ROUTES.find((r) => r.hash === active) || {}).label || ''}`;
}

window.addEventListener('hashchange', render);
render();
