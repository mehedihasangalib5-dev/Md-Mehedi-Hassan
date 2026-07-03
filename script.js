/* ═══════════════════════════════════════════════════
   Md Mehedi Hassan — Portfolio Script
   Features: Loader, Particles, Navbar, Typed Text,
   Reveal Animations, Skill Bars, Stat Counters,
   Dark/Light Toggle, Scroll-to-Top, Contact Form
═══════════════════════════════════════════════════ */

/* ── LOADER ─────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    startTyping();
    initReveal();
  }, 2000);
});

/* ── PARTICLES ──────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = 60;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function getRandColor() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    return isDark ? `rgba(0,232,124,` : `rgba(0,168,85,`;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 2 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.a  = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = getRandColor() + this.a + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = (1 - dist / 120) * 0.15;
          ctx.strokeStyle = getRandColor() + alpha + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ── NAVBAR ─────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('scroll-top').classList.toggle('visible', window.scrollY > 400);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

/* ── ACTIVE NAV LINK ON SCROLL ───────────────────── */
const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      allNavLinks.forEach(a => a.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.style.color = 'var(--accent)';
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ── TYPING ANIMATION ───────────────────────────── */
const typedTexts = [
  'Passionate Learner.',
  'Web Developer.',
  'Creative Designer.',
  'Python Programmer.'
];
let typeIdx = 0, charIdx = 0, isDeleting = false;
const typedEl = document.getElementById('typed-text');

function startTyping() {
  function type() {
    const current = typedTexts[typeIdx];
    if (!isDeleting) {
      typedEl.textContent = current.substring(0, ++charIdx);
      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      typedEl.textContent = current.substring(0, --charIdx);
      if (charIdx === 0) {
        isDeleting = false;
        typeIdx = (typeIdx + 1) % typedTexts.length;
      }
    }
    setTimeout(type, isDeleting ? 60 : 90);
  }
  type();
}

/* ── REVEAL ON SCROLL ───────────────────────────── */
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = (entry.target.closest('.projects-grid, .cert-grid, .exp-grid, .stats-grid')
          ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 80
          : 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => observer.observe(el));
}

/* ── SKILL BARS ─────────────────────────────────── */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(fill => {
        const w = fill.dataset.width;
        setTimeout(() => { fill.style.width = w + '%'; }, 200);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillSection = document.getElementById('skills');
if (skillSection) skillObserver.observe(skillSection);

/* ── STAT COUNTERS ──────────────────────────────── */
function animateCounter(el, target, duration = 1600) {
  let start = null;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(num => {
        animateCounter(num, parseInt(num.dataset.target));
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

const statsSection = document.getElementById('stats');
if (statsSection) statObserver.observe(statsSection);

/* ── DARK/LIGHT TOGGLE ──────────────────────────── */
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateToggleIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
  updateToggleIcon(next);
});

function updateToggleIcon(theme) {
  themeToggle.innerHTML = theme === 'dark'
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
}

/* ── SCROLL TO TOP ──────────────────────────────── */
document.getElementById('scroll-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── CONTACT FORM ───────────────────────────────── */
const form = document.getElementById('contact-form');
const success = document.getElementById('form-success');

// Supabase project + Edge Function endpoint.
// The "anon"/publishable key below is safe to expose in client-side code —
// it only allows what your Row Level Security policies permit.
const SUPABASE_FUNCTION_URL = 'https://ljdauadokznlpkdytipm.supabase.co/functions/v1/contact-notify';
const SUPABASE_ANON_KEY = 'sb_publishable_MDlwveB0pbBIlkp5QP3_qg_e5w-Qzcc';

form.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const originalBg = btn.style.background;

  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
  btn.disabled = true;

  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    subject: form.subject.value.trim(),
    message: form.message.value.trim(),
  };

  try {
    const res = await fetch(SUPABASE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.error || 'Something went wrong. Please try again.');
    }

    btn.innerHTML = '<i class="fa-solid fa-check"></i> Sent!';
    btn.style.background = 'var(--accent2)';
    success.textContent = "✅ Message sent! I'll get back to you soon.";
    success.classList.add('show');
    form.reset();
  } catch (err) {
    console.error('Contact form error:', err);
    btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Failed';
    btn.style.background = '#e74c3c';
    success.textContent = '⚠️ ' + (err.message || 'Failed to send. Please try again later.');
    success.classList.add('show');
  } finally {
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      btn.style.background = originalBg;
      btn.disabled = false;
      success.classList.remove('show');
    }, 4000);
  }
});

/* ── FOOTER YEAR ────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── SMOOTH HOVER TILT on project cards ─────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
    card.style.transform = `translateY(-6px) rotateX(${-y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── GALLERY LIGHTBOX (simple) ───────────────────── */
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const src = item.querySelector('img').src;
    const caption = item.querySelector('.gallery-overlay span')?.textContent || '';

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9990;
      background:rgba(0,0,0,0.92);
      display:flex;flex-direction:column;
      align-items:center;justify-content:center;gap:16px;
      cursor:pointer;padding:24px;
    `;
    const img = document.createElement('img');
    img.src = src;
    img.style.cssText = 'max-height:80vh;max-width:90vw;border-radius:12px;object-fit:contain;';
    const cap = document.createElement('p');
    cap.textContent = caption;
    cap.style.cssText = 'color:#fff;font-size:1rem;font-weight:600;';
    overlay.appendChild(img);
    overlay.appendChild(cap);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', () => overlay.remove());
  });
});

/* ── TIMELINE HOVER GLOW ────────────────────────── */
document.querySelectorAll('.timeline-item').forEach(item => {
  const dot = item.querySelector('.timeline-dot');
  item.addEventListener('mouseenter', () => {
    dot.style.background    = 'var(--accent)';
    dot.style.borderColor   = 'var(--accent)';
    dot.style.color         = '#000';
    dot.style.boxShadow     = '0 0 20px var(--accent-glow)';
  });
  item.addEventListener('mouseleave', () => {
    if (!dot.classList.contains('current')) {
      dot.style.background  = '';
      dot.style.borderColor = '';
      dot.style.color       = '';
      dot.style.boxShadow   = '';
    }
  });
});
