// Efecto de profundidad en la portada: la figura se inclina hacia el cursor
// y el nombre se mueve en sentido contrario. Para quitarlo: borrar la etiqueta
// <script src="hero-motion.js"> del index.html (y el bloque "hero-motion" del CSS).
(() => {
  const hero = document.querySelector('.hero');
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let tx = 0, ty = 0, x = 0, y = 0, raf = null;

  const frame = () => {
    x += (tx - x) * 0.08;
    y += (ty - y) * 0.08;
    hero.style.setProperty('--mx', x.toFixed(4));
    hero.style.setProperty('--my', y.toFixed(4));
    raf = (Math.abs(tx - x) + Math.abs(ty - y) > 0.001) ? requestAnimationFrame(frame) : null;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

  const aim = (e) => {
    const r = hero.getBoundingClientRect();
    tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
    ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
    kick();
  };
  const rest = () => { tx = 0; ty = 0; kick(); };

  hero.addEventListener('pointermove', aim);
  hero.addEventListener('pointerleave', rest);
  hero.addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') rest(); });
  hero.addEventListener('pointercancel', rest);
})();
