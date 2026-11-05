// Pages projet · apparition, progression, visionneuse
(function () {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.fade').forEach(el => io.observe(el));

  const bar = document.getElementById('progress');
  const onScroll = () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight) * 100) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const viewer = document.getElementById('viewer');
  const vImg = document.getElementById('vImg');
  const vCap = document.getElementById('vCap');
  const prev = document.getElementById('vPrev');
  const next = document.getElementById('vNext');
  let list = [], i = 0;

  const show = () => {
    const it = list[i];
    vImg.src = it.src; vImg.alt = it.cap || '';
    vCap.textContent = it.cap || '';
    prev.style.display = next.style.display = list.length > 1 ? '' : 'none';
    viewer.scrollTop = 0;
  };
  const open = (items, idx, tall, width) => {
    list = items; i = idx; show();
    viewer.classList.toggle('tall', !!tall);
    viewer.style.setProperty('--tw', (width || 1000) + 'px');
    viewer.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => { viewer.classList.remove('open'); document.body.style.overflow = ''; };
  const move = d => { i = (i + d + list.length) % list.length; show(); };

  document.querySelectorAll('[data-group]').forEach(btn => btn.addEventListener('click', () => {
    const group = [...document.querySelectorAll('[data-group="' + btn.dataset.group + '"]')];
    const items = group.map(b => ({ src: b.dataset.src || b.querySelector('img').getAttribute('src'), cap: b.dataset.cap }));
    open(items, group.indexOf(btn), btn.dataset.tall === '1', parseInt(btn.dataset.w || '1000', 10));
  }));

  document.getElementById('vClose').addEventListener('click', close);
  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  viewer.addEventListener('click', e => { if (e.target === viewer || e.target.tagName === 'FIGURE') close(); });
  document.addEventListener('keydown', e => {
    if (!viewer.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight' && list.length > 1) move(1);
    if (e.key === 'ArrowLeft' && list.length > 1) move(-1);
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
