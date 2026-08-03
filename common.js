/* ══════════════════════════════════════════════════════════════
   ZETWAL — COMPORTEMENTS PARTAGÉS
   Curseur doré, particules, nav, connexion, theme toggle.
   Chaque page appelle ZetwalCommon.init({ page: 'shop' }) au chargement.
══════════════════════════════════════════════════════════════ */

const ZETWAL_CONFIG = {
    firebase: {
        apiKey: "AIzaSyAjCnmtvu0tqlsNDEtKraKBG79y12qYeCQ",
        authDomain: "lavrizetwal.firebaseapp.com",
        projectId: "lavrizetwal",
        storageBucket: "lavrizetwal.firebasestorage.app",
        messagingSenderId: "291921316186",
        appId: "1:291921316186:web:f55e8b34526960df394b63"
    },
    supabase: {
        url: 'https://mzwibzvdcwapqrtbhxox.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16d2lienZkY3dhcHFydGJoeG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNzcxNTIsImV4cCI6MjA5MTc1MzE1Mn0.utazGnMswFOiArB66kfok7n2ds1Zr2wyVBRYVOFRT6c'
    }
};

const ZETWAL_NAV_ITEMS = [
    { key: 'index', href: 'index.html', label: 'Akèy' },
    { key: 'lavri',  href: 'lavri.html', label: 'Lavri' },
    { key: 'shop',   href: 'shop.html',  label: 'Shop' },
    { key: 'mall',   href: 'mall.html',  label: 'Mall' },
    { key: 'games',  href: 'games.html', label: 'Jwèt' }
];

const ZetwalCommon = (() => {

    let fbAuth = null;
    let confirmationResult = null;

    /* ── Curseur doré + traînée ─────────────────────────────── */
    function initCursor() {
        if (document.getElementById('cursor-dot')) return;
        const dot = document.createElement('div'); dot.id = 'cursor-dot';
        const ring = document.createElement('div'); ring.id = 'cursor-ring';
        document.body.append(dot, ring);

        const TRAIL_COUNT = 14;
        const trails = [];
        for (let i = 0; i < TRAIL_COUNT; i++) {
            const t = document.createElement('div');
            t.className = 'cursor-trail';
            document.body.appendChild(t);
            trails.push({ el: t, x: 0, y: 0 });
        }
        let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
        document.addEventListener('mousemove', e => {
            mouseX = e.clientX; mouseY = e.clientY;
            dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px';
        });
        document.body.addEventListener('mouseenter', e => {
            const t = e.target.closest('a,button,.btn-gold,.card-wrap');
            if (!t) return;
            dot.style.width = '20px'; dot.style.height = '20px'; dot.style.background = 'var(--gold-bright)';
            ring.style.width = '56px'; ring.style.height = '56px'; ring.style.borderColor = 'rgba(240,208,96,0.9)';
        }, true);
        document.body.addEventListener('mouseleave', e => {
            const t = e.target.closest('a,button,.btn-gold,.card-wrap');
            if (!t) return;
            dot.style.width = '12px'; dot.style.height = '12px'; dot.style.background = 'var(--gold)';
            ring.style.width = '36px'; ring.style.height = '36px'; ring.style.borderColor = 'rgba(201,168,76,0.6)';
        }, true);

        let trailPositions = Array(TRAIL_COUNT).fill().map(() => ({ x: 0, y: 0 }));
        (function animateCursor() {
            ringX += (mouseX - ringX) * 0.12; ringY += (mouseY - ringY) * 0.12;
            ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px';
            trailPositions.unshift({ x: mouseX, y: mouseY });
            trailPositions = trailPositions.slice(0, TRAIL_COUNT);
            trails.forEach((t, i) => {
                const p = trailPositions[i] || trailPositions[trailPositions.length - 1];
                t.x += (p.x - t.x) * 0.25; t.y += (p.y - t.y) * 0.25;
                t.el.style.left = t.x + 'px'; t.el.style.top = t.y + 'px';
                const alpha = (1 - i / TRAIL_COUNT) * 0.5;
                const size = 6 * (1 - i / TRAIL_COUNT);
                t.el.style.opacity = alpha; t.el.style.width = size + 'px'; t.el.style.height = size + 'px';
            });
            requestAnimationFrame(animateCursor);
        })();
    }

    /* ── Particules 2D réactives à la souris ────────────────── */
    function initParticles() {
        if (document.getElementById('particle-canvas')) return;
        const canvas = document.createElement('canvas'); canvas.id = 'particle-canvas';
        document.body.prepend(canvas);
        const ctx = canvas.getContext('2d');
        let w = window.innerWidth, h = window.innerHeight;
        canvas.width = w; canvas.height = h;
        let mx = w / 2, my = h / 2;
        document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

        const NUM = 160;
        const particles = Array.from({ length: NUM }, () => {
            const x = Math.random() * w, y = Math.random() * h;
            return {
                x, y, ox: x, oy: y,
                vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 2.2 + 0.4,
                color: `rgba(201,168,76,${(Math.random() * 0.4 + 0.1).toFixed(2)})`
            };
        });

        function drawConnections() {
            const MAX_DIST = 110;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < MAX_DIST) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(201,168,76,${(1 - d / MAX_DIST) * 0.12})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        (function animate() {
            ctx.clearRect(0, 0, w, h);
            drawConnections();
            particles.forEach(p => {
                const dx = mx - p.x, dy = my - p.y, dist = Math.sqrt(dx * dx + dy * dy);
                const REPEL = 120;
                if (dist < REPEL) {
                    const f = (REPEL - dist) / REPEL;
                    p.vx -= (dx / dist) * f * 1.5; p.vy -= (dy / dist) * f * 1.5;
                }
                p.vx += (p.ox - p.x) * 0.004; p.vy += (p.oy - p.y) * 0.004;
                p.vx *= 0.96; p.vy *= 0.96;
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color; ctx.shadowColor = '#c9a84c'; ctx.shadowBlur = 6;
                ctx.fill(); ctx.shadowBlur = 0;
            });
            requestAnimationFrame(animate);
        })();
        window.addEventListener('resize', () => {
            w = window.innerWidth; h = window.innerHeight;
            canvas.width = w; canvas.height = h;
        });
    }

    /* ── Nebula, vignette, scanlines (décor de fond) ────────── */
    function initBackdrop() {
        if (document.querySelector('.nebula')) return;
        document.body.insertAdjacentHTML('afterbegin',
            '<div class="nebula"><div class="nb"></div><div class="nb"></div></div>' +
            '<div id="vignette"></div><div id="scanlines"></div>'
        );
    }

    /* ── Theme toggle ────────────────────────────────────────── */
    function toggleTheme() {
        document.body.classList.toggle('light-mode');
        localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    }
    function initTheme() {
        if (localStorage.getItem('theme') === 'light') document.body.classList.add('light-mode');
        if (!document.querySelector('.theme-toggle')) {
            const btn = document.createElement('button');
            btn.className = 'theme-toggle';
            btn.title = 'Chanje Mode';
            btn.textContent = '🌓';
            btn.onclick = toggleTheme;
            document.body.appendChild(btn);
        }
    }

    /* ── Nav transparente → figée au scroll ─────────────────── */
    function initNavScroll() {
        const nav = document.querySelector('.nav');
        if (!nav) return;
        function update() { nav.classList.toggle('scrolled', window.scrollY > 40); }
        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    /* ── Reveal au scroll ───────────────────────────────────── */
    function initReveal() {
        function reveal() {
            document.querySelectorAll('.reveal').forEach(el => {
                if (el.getBoundingClientRect().top < window.innerHeight - 100) el.classList.add('active');
            });
        }
        window.addEventListener('scroll', reveal, { passive: true });
        reveal();

        const parallaxEls = document.querySelectorAll('.section-parallax');
        if (parallaxEls.length) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach((entry, i) => {
                    if (entry.isIntersecting) setTimeout(() => entry.target.classList.add('in-view'), i * 80);
                });
            }, { threshold: 0.1 });
            parallaxEls.forEach(el => observer.observe(el));
        }
    }

    /* ── Nav : liens + logo/marque ──────────────────────────── */
    function initNav(page, brand) {
        const ul = document.getElementById('nav-links');
        if (ul) {
            ul.innerHTML = ZETWAL_NAV_ITEMS.map(item =>
                `<li><a href="${item.href}"${item.key === page ? ' class="active"' : ''}>${item.label}</a></li>`
            ).join('');
        }
        const logoBrand = document.getElementById('nav-brand-text');
        if (logoBrand && brand) logoBrand.innerHTML = `ZETWAL <span>${brand}</span>`;
    }

    /* ── Widget de connexion (bouton + avatar + dropdown + modale) ── */
    function initAuthWidget() {
        const mount = document.getElementById('zetwal-auth-mount');
        if (!mount || document.getElementById('nav-login-btn')) return;
        mount.innerHTML = `
            <button id="nav-login-btn" class="nav-auth-btn" onclick="ZetwalCommon.openAuthModal()">Konekte</button>
            <img id="nav-auth-avatar" class="nav-auth-avatar" src="" alt="Profil" style="display:none" onclick="ZetwalCommon.toggleAuthDropdown()">
        `;
        document.body.insertAdjacentHTML('beforeend', `
            <div class="auth-dropdown" id="auth-dropdown">
                <div class="auth-drop-name" id="auth-drop-name">—</div>
                <div class="auth-drop-email" id="auth-drop-email">—</div>
                <div class="auth-drop-sep"></div>
                <button class="auth-drop-btn" onclick="ZetwalCommon.authSignOut()">🚪 Dekonekte</button>
            </div>
            <div class="auth-overlay" id="auth-overlay">
                <div class="auth-modal">
                    <h2 style="color:var(--gold);margin-bottom:25px;font-family:'Cormorant Garamond',serif;letter-spacing:2px">KONEKSYON</h2>
                    <div id="auth-main-view">
                        <button class="btn-auth btn-google" onclick="ZetwalCommon.authSignInGoogle()">Konekte ak Google</button>
                        <div style="margin:20px 0;color:rgba(255,255,255,0.3);font-size:0.7rem;letter-spacing:2px">OSWA</div>
                        <input type="tel" id="phone-input" class="auth-input" placeholder="+509 XXXX XXXX">
                        <div id="recaptcha-container"></div>
                        <button class="btn-auth btn-phone" onclick="ZetwalCommon.authSignInPhone()">Konekte ak Telefòn</button>
                    </div>
                    <div id="otp-view" style="display:none">
                        <p style="font-size:0.8rem;margin-bottom:15px;opacity:0.7">Antre kòd ou resevwa a :</p>
                        <input type="text" id="otp-input" class="auth-input" placeholder="123456">
                        <button class="btn-auth btn-phone" onclick="ZetwalCommon.authVerifyOtp()">Verifye Kòd</button>
                    </div>
                    <button style="background:transparent;border:none;color:rgba(255,255,255,0.4);cursor:none;font-size:0.65rem;margin-top:20px;text-transform:uppercase;letter-spacing:1px" onclick="ZetwalCommon.closeAuthModal()">Anile</button>
                </div>
            </div>
        `);

        document.addEventListener('click', e => {
            const dd = document.getElementById('auth-dropdown');
            const av = document.getElementById('nav-auth-avatar');
            if (dd && dd.classList.contains('open') && !dd.contains(e.target) && e.target !== av) dd.classList.remove('open');
        });
    }

    function initFirebaseAuth() {
        if (typeof firebase === 'undefined') return;
        if (!firebase.apps.length) firebase.initializeApp(ZETWAL_CONFIG.firebase);
        fbAuth = firebase.auth();
        fbAuth.onAuthStateChanged(user => {
            const loginBtn = document.getElementById('nav-login-btn');
            const avatarEl = document.getElementById('nav-auth-avatar');
            const nameEl = document.getElementById('auth-drop-name');
            const emailEl = document.getElementById('auth-drop-email');
            if (user) {
                if (loginBtn) loginBtn.style.display = 'none';
                if (avatarEl) {
                    avatarEl.style.display = 'inline-block';
                    avatarEl.src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.phoneNumber || 'U')}&background=c9a84c&color=000&size=56`;
                }
                if (nameEl) nameEl.textContent = user.displayName || user.phoneNumber || 'Itilizatè';
                if (emailEl) emailEl.textContent = user.email || '';
            } else {
                if (loginBtn) loginBtn.style.display = 'flex';
                if (avatarEl) avatarEl.style.display = 'none';
                if (nameEl) nameEl.textContent = '—';
                if (emailEl) emailEl.textContent = '—';
            }
            window.dispatchEvent(new CustomEvent('zetwal:authchange', { detail: { user } }));
        });
    }

    /* ── Actions exposées aux boutons onclick ────────────────── */
    function openAuthModal() { document.getElementById('auth-overlay').classList.add('open'); }
    function closeAuthModal() { document.getElementById('auth-overlay').classList.remove('open'); }
    function toggleAuthDropdown() { document.getElementById('auth-dropdown').classList.toggle('open'); }

    async function authSignInGoogle() {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            await fbAuth.signInWithPopup(provider);
            closeAuthModal();
        } catch (e) {
            if (e.code !== 'auth/popup-closed-by-user') alert(e.message);
        }
    }
    function ensureRecaptcha() {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', { size: 'invisible' });
        }
    }
    async function authSignInPhone() {
        ensureRecaptcha();
        const phone = document.getElementById('phone-input').value;
        try {
            confirmationResult = await fbAuth.signInWithPhoneNumber(phone, window.recaptchaVerifier);
            document.getElementById('auth-main-view').style.display = 'none';
            document.getElementById('otp-view').style.display = 'block';
        } catch (e) { alert(e.message); }
    }
    async function authVerifyOtp() {
        const code = document.getElementById('otp-input').value;
        try { await confirmationResult.confirm(code); closeAuthModal(); }
        catch (e) { alert('Kòd la pa bon'); }
    }
    async function authSignOut() {
        document.getElementById('auth-dropdown').classList.remove('open');
        await fbAuth.signOut();
    }

    /* ── Point d'entrée ──────────────────────────────────────── */
    function init(opts = {}) {
        initBackdrop();
        initParticles();
        // cursor:false — désactive le curseur personnalisé (effet daté sur certaines pages)
        if (opts.cursor !== false) initCursor();
        else document.documentElement.classList.add('no-custom-cursor');
        initTheme();
        initReveal();
        initNavScroll();
        initNav(opts.page, opts.brand);
        // authWidget:false — pages qui ont déjà leur propre système de connexion (ex: shop.html)
        if (opts.authWidget !== false) {
            initAuthWidget();
            initFirebaseAuth();
        }
    }

    return {
        init, toggleTheme,
        openAuthModal, closeAuthModal, toggleAuthDropdown,
        authSignInGoogle, authSignInPhone, authVerifyOtp, authSignOut
    };
})();

// Exposés explicitement sur window : accessible depuis les <script type="module">
// (games.html utilise le SDK Firebase v9 modulaire, hors de la portée des scripts classiques)
window.ZetwalCommon = ZetwalCommon;
window.ZETWAL_CONFIG = ZETWAL_CONFIG;
