(() => {
  // Revelado al hacer scroll (el contenido es visible por defecto si no hay JS)
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('in'));
  }

  // Menú móvil
  const btn = document.querySelector('.menu-btn');
  const menu = document.getElementById('menu');
  const setMenu = (open) => {
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    document.documentElement.style.overflow = open ? 'hidden' : '';
  };
  btn.addEventListener('click', () => setMenu(btn.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  window.matchMedia('(min-width: 821px)').addEventListener('change', (m) => { if (m.matches) setMenu(false); });

  // Enlace activo según la sección visible
  const links = [...document.querySelectorAll('.nav-links a')];
  const secs = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const so = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => {
          if (a.getAttribute('href') === '#' + e.target.id) a.setAttribute('aria-current', 'page');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach((s) => so.observe(s));
  }

  // Botón volver arriba
  const top = document.querySelector('.to-top');
  const onScroll = () => top.classList.toggle('show', window.scrollY > window.innerHeight * 0.8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Galería en abanico de trabajos
  const fan = document.querySelector('.fan');
  if (fan) {
    const cards = [...fan.querySelectorAll('.fan-card')];
    const details = [...document.querySelectorAll('.fan-detail')];
    const ticks = [...document.querySelectorAll('.fan-ticks span')];
    let active = 0;
    const select = (i) => {
      active = i;
      cards.forEach((c, k) => {
        c.style.setProperty('--o', k - i);
        c.style.setProperty('--a', Math.abs(k - i));
        c.classList.toggle('on', k === i);
        c.setAttribute('aria-current', k === i ? 'true' : 'false');
      });
      details.forEach((d, k) => d.classList.toggle('on', k === i));
      ticks.forEach((t, k) => t.classList.toggle('on', k === i));
    };
    const canHover = window.matchMedia('(hover: hover) and (min-width: 821px)');
    cards.forEach((c, i) => {
      c.addEventListener('pointerenter', () => { if (canHover.matches) select(i); });
      c.addEventListener('focus', () => select(i));
      c.addEventListener('click', () => select(i));
    });
    fan.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const n = Math.max(0, Math.min(cards.length - 1, active + (e.key === 'ArrowRight' ? 1 : -1)));
      cards[n].focus();
    });
    // en celular el abanico se desliza: queda elegida la tarjeta más cercana al centro
    let ticking = false;
    fan.addEventListener('scroll', () => {
      if (ticking || fan.scrollWidth <= fan.clientWidth + 2) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const mid = fan.getBoundingClientRect().left + fan.clientWidth / 2;
        let best = 0, bestD = Infinity;
        cards.forEach((c, k) => {
          const r = c.getBoundingClientRect();
          const d = Math.abs(r.left + r.width / 2 - mid);
          if (d < bestD) { bestD = d; best = k; }
        });
        if (best !== active) select(best);
      });
    }, { passive: true });
    select(0);
  }
})();
