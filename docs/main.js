document.documentElement.classList.add('js');
const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const label = toggle.querySelector('.menu-label');
const nav = document.querySelector('#main-nav');
const compact = matchMedia('(max-width: 1080px)');
const setMenu = (open, restoreFocus = false) => {
  toggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
  label.textContent = open ? 'Fechar' : 'Menu';
  if (restoreFocus) toggle.focus();
};
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (!link) return;
  setMenu(false);
  const id = link.getAttribute('href');
  if (id?.startsWith('#') && compact.matches) {
    const target = document.querySelector(id);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({preventScroll: true});
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), {once:true});
    }
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, true);
});
document.addEventListener('click', (event) => {
  if (!header.contains(event.target)) setMenu(false);
});
header.addEventListener('focusout', (event) => {
  if (event.relatedTarget && !header.contains(event.relatedTarget)) setMenu(false);
});
compact.addEventListener('change', () => setMenu(false));
const updateHeaderHeight = () => document.documentElement.style.setProperty('--header-height', `${Math.ceil(header.getBoundingClientRect().height)}px`);
updateHeaderHeight();
new ResizeObserver(updateHeaderHeight).observe(header);
const links = [...nav.querySelectorAll('.nav-links a')];
const sections = [...document.querySelectorAll('main > section')];
let scheduled = false;
const updateCurrentSection = () => {
  scheduled = false;
  const top = header.getBoundingClientRect().height + 90;
  const current = sections.find(section => {
    const rect = section.getBoundingClientRect();
    return rect.top <= top && rect.bottom > top;
  });
  links.forEach(link => {
    if (current?.id && link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  header.classList.toggle('is-scrolled', window.scrollY > 8);
};
window.addEventListener('scroll', () => {
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(updateCurrentSection);
  }
}, {passive:true});
window.addEventListener('resize', updateCurrentSection);
updateCurrentSection();
