(() => {
  const root = document.documentElement;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const forceReduced = new URLSearchParams(location.search).get('reduce') === '1';
  const updatePreference = () => {
    root.dataset.motion = forceReduced || preference.matches ? 'reduced' : 'full';
  };
  updatePreference();
  if (preference.addEventListener) preference.addEventListener('change', updatePreference);
  else preference.addListener(updatePreference);

  if (!('IntersectionObserver' in window)) return;
  const blocks = [...document.querySelectorAll([
    '.hero-copy', '.hero-photo', '.section-cue',
    '.professional-photo', '.about-content',
    '.services-intro', '.services-list > li', '.services-action',
    '.care-heading', '.care-list > li',
    '.office-layout > div', '.office-photo',
    '.contact-inner', '.footer-main', '.footer-bottom'
  ].join(','))];
  const entered = new WeakSet();
  const animations = new Set();
  let observer;

  const showNow = block => {
    entered.add(block);
    block.classList.remove('is-entering');
    animations.delete(block);
    observer?.unobserve(block);
  };
  const showTarget = target => {
    if (!target) return;
    blocks.forEach(block => {
      if (target === block || target.contains(block) || block.contains(target)) showNow(block);
    });
  };
  const hashTarget = hash => {
    if (!hash || hash === '#') return null;
    try { return document.getElementById(decodeURIComponent(hash.slice(1))); }
    catch { return null; }
  };
  blocks.forEach(block => {
    block.classList.add('motion-reveal');
    if (block.matches('.services-list > li')) {
      const index = [...block.parentElement.children].indexOf(block);
      block.style.setProperty('--motion-delay', `${(index % 4) * 65}ms`);
    }
    block.addEventListener('animationend', event => {
      if (event.target === block) {
        block.classList.remove('is-entering');
        animations.delete(block);
      }
    });
  });
  showTarget(hashTarget(location.hash));

  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entered.has(entry.target)) return;
      const block = entry.target;
      entered.add(block);
      observer.unobserve(block);
      if (block.contains(document.activeElement)) return;
      block.classList.add('is-entering');
      animations.add(block);
    });
  }, {threshold: .08, rootMargin: '0px 0px -24px 0px'});
  blocks.forEach(block => { if (!entered.has(block)) observer.observe(block); });

  // Navegar e mover o foco nunca espera por uma entrada visual.
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href]');
    if (!anchor) return;
    const url = new URL(anchor.href, location.href);
    if (url.origin === location.origin && url.pathname === location.pathname && url.hash) {
      showTarget(hashTarget(url.hash));
    }
  }, {capture:true});
  document.addEventListener('focusin', event => showTarget(event.target));
  window.addEventListener('hashchange', () => showTarget(hashTarget(location.hash)));
  // Quando o usuário muda a preferência durante uma entrada, encerra-se o deslocamento.
  const settleActive = () => {
    if (forceReduced || preference.matches) [...animations].forEach(showNow);
  };
  if (preference.addEventListener) preference.addEventListener('change', settleActive);
  else preference.addListener(settleActive);
})();
