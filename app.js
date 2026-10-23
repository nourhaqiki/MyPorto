(() => {
  const STORAGE_KEY = "my-porto-projects";
  const THEME_KEY = "my-porto-theme";
  const demoProjects = [
    {
      id: "ruang-kopi",
      title: "Ruang Kopi",
      category: "Web Design",
      description: "Identitas digital yang hangat untuk kedai kopi independen, dengan pengalaman pemesanan yang sederhana.",
      cover: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=85"
      ],
      year: "2025"
    },
    {
      id: "forma-studio",
      title: "Forma Studio",
      category: "Branding & Web",
      description: "Situs portofolio studio arsitektur yang menempatkan karya dan tipografi sebagai fokus utama.",
      cover: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85"
      ],
      year: "2024"
    },
    {
      id: "nusa-travel",
      title: "Nusa Travel",
      category: "UI/UX Design",
      description: "Konsep aplikasi perjalanan untuk membantu menemukan destinasi lokal dengan cara yang lebih personal.",
      cover: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85"
      ],
      year: "2024"
    },
    {
      id: "daily-notes",
      title: "Daily Notes",
      category: "Development",
      description: "Aplikasi catatan ringan dengan antarmuka yang tenang dan fokus pada kebiasaan menulis harian.",
      cover: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1200&q=85"
      ],
      year: "2023"
    }
  ];

  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  function getProjects() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(demoProjects));
        return demoProjects;
      }
      const projects = JSON.parse(saved);
      if (!Array.isArray(projects)) throw new Error("Format data portofolio tidak valid.");
      return projects;
    } catch (error) {
      console.error("Tidak dapat membaca data portofolio:", error);
      return [];
    }
  }

  function saveProjects(projects) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }

  function validImageURL(value) {
    try {
      const url = new URL(value, window.location.href);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  }

  function renderHeader(page) {
    const current = page === "project" ? "portfolio" : page;
    return `<header class="site-header"><div class="container nav-wrap">
      <a class="brand" href="index.html" aria-label="MY PORTO beranda">MY PORTO</a>
      <nav class="nav-links" id="site-navigation" aria-label="Navigasi utama">
        <a href="index.html" ${current === "home" ? 'aria-current="page"' : ""}>Beranda</a>
        <a href="portfolio.html" ${current === "portfolio" ? 'aria-current="page"' : ""}>Portofolio</a>
        <a href="about.html" ${current === "about" ? 'aria-current="page"' : ""}>Tentang Saya</a>
      </nav>
      <div class="nav-actions">
        <button class="theme-toggle" type="button" aria-label="Ganti tema">◐</button>
        <button class="menu-toggle" type="button" aria-label="Buka menu" aria-expanded="false" aria-controls="site-navigation">☰</button>
      </div>
    </div></header>`;
  }

  function renderFooter() {
    return `<footer class="site-footer"><div class="container footer-inner">
      <span>© <span data-year></span> MY PORTO. Dibuat dengan penuh perhatian.</span>
      <div class="footer-links">
        <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a>
        <a href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
        <a href="mailto:hello@example.com">Email</a>
        <a class="back-top" href="#top">Kembali ke atas ↑</a>
      </div>
    </div></footer>`;
  }

  function projectCard(project) {
    const cover = validImageURL(project.cover);
    return `<a class="project-card reveal" href="project.html?id=${encodeURIComponent(project.id)}">
      <img src="${escapeHTML(cover)}" alt="${escapeHTML(project.title)}" loading="lazy">
      <div class="card-copy">
        <p class="card-category">${escapeHTML(project.category)}</p>
        <h3>${escapeHTML(project.title)}</h3>
        <p>${escapeHTML(project.description)}</p>
      </div>
    </a>`;
  }

  function renderHome(projects) {
    const featured = projects.slice(0, 3);
    return `<section class="container hero" id="top">
      <p class="eyebrow">Halo, selamat datang di ruang karya saya</p>
      <h1>Merancang hal digital yang <span>berarti.</span></h1>
      <p class="hero-copy">Saya Nama Anda, seorang developer dan kreator digital yang senang mengubah ide menjadi pengalaman yang sederhana, berguna, dan berkesan.</p>
      <a class="button" href="portfolio.html">Jelajahi karya <span aria-hidden="true">↗</span></a>
    </section>
    <section class="container section">
      <div class="section-heading"><div><p class="eyebrow">Pilihan karya</p><h2>Beberapa proyek terbaru</h2></div></div>
      <div class="project-grid featured">${featured.length ? featured.map(projectCard).join("") : '<p class="empty-state">Belum ada proyek. Silakan tambahkan dari dashboard admin.</p>'}</div>
      <div class="section-action"><a class="button secondary" href="portfolio.html">Lihat semua portofolio</a></div>
    </section>
    <section class="container section about-preview">
      <div class="portrait-placeholder reveal" aria-label="Placeholder foto profil">N</div>
      <div class="about-copy reveal"><p class="eyebrow">Sedikit tentang saya</p><h2>Berpikir jernih. Membuat dengan tujuan.</h2>
        <p>Saya percaya desain dan teknologi yang baik tidak perlu rumit. Fokus saya adalah membuat solusi digital yang terasa mudah digunakan sekaligus punya karakter.</p>
        <a class="button secondary" href="about.html">Kenali saya lebih dekat</a>
      </div>
    </section>`;
  }

  function renderPortfolio(projects) {
    return `<section class="container page-heading" id="top"><p class="eyebrow">Kumpulan karya</p><h1>Portofolio</h1></section>
      <section class="container section" style="padding-top: 12px"><div class="project-grid">
        ${projects.length ? projects.map(projectCard).join("") : '<p class="empty-state">Belum ada proyek untuk ditampilkan.</p>'}
      </div></section>`;
  }

  function renderProject(projects) {
    const project = projects.find((item) => item.id === new URLSearchParams(location.search).get("id"));
    if (!project) return `<section class="container page-heading" id="top"><p class="eyebrow">Proyek tidak ditemukan</p><h1>Karya ini belum tersedia.</h1><a class="button secondary" href="portfolio.html">Kembali ke portofolio</a></section>`;
    const gallery = (Array.isArray(project.gallery) ? project.gallery : []).map((image, index) => {
      const url = validImageURL(image);
      return url ? `<img src="${escapeHTML(url)}" alt="${escapeHTML(project.title)} — gambar ${index + 1}" loading="lazy">` : "";
    }).join("");
    const cover = validImageURL(project.cover);
    return `<article class="container project-detail" id="top">
      <p class="eyebrow"><a href="portfolio.html">Portofolio</a> / ${escapeHTML(project.category)}</p>
      <h1>${escapeHTML(project.title)}</h1>
      <p class="project-meta">${escapeHTML(project.year || "Proyek pilihan")} · ${escapeHTML(project.category)}</p>
      <img class="project-cover" src="${escapeHTML(cover)}" alt="${escapeHTML(project.title)}" fetchpriority="high">
      <div class="detail-copy"><p>${escapeHTML(project.description)}</p></div>
      ${gallery ? `<h2 class="serif">Cuplikan proyek</h2><div class="gallery-grid">${gallery}</div>` : ""}
    </article>`;
  }

  function renderAbout() {
    return `<section class="container page-heading" id="top"><p class="eyebrow">Tentang saya</p><h1>Senang berkenalan.</h1></section>
      <section class="container profile-layout">
        <div class="portrait-placeholder reveal" aria-label="Placeholder foto profil">N</div>
        <div class="profile-copy reveal">
          <p class="eyebrow">Nama Anda · Developer & Desainer Digital</p>
          <h2 class="serif">Saya membuat pengalaman digital dengan hati dan tujuan.</h2>
          <p>Saya adalah kreator digital yang tertarik pada desain antarmuka, pengembangan web, dan bagaimana teknologi bisa membantu kehidupan sehari-hari. Saya menikmati proses dari memahami masalah hingga merapikan detail akhir.</p>
          <p>Di luar layar, saya senang belajar hal baru, membaca, dan mencari inspirasi dari sekitar. Saat ini saya terbuka untuk kolaborasi dan kesempatan kerja yang menarik.</p>
          <div class="social-row"><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://github.com/" target="_blank" rel="noreferrer">GitHub ↗</a><a href="mailto:hello@example.com">Email ↗</a></div>
          <div class="timeline">
            <div class="timeline-item"><p class="eyebrow">2022 — Sekarang</p><h3>Freelance Web Developer</h3><p>Membantu bisnis dan individu membangun identitas serta produk digital.</p></div>
            <div class="timeline-item"><p class="eyebrow">2020 — 2024</p><h3>Universitas Anda · Informatika</h3><p>Mempelajari pengembangan perangkat lunak, desain, dan pemecahan masalah.</p></div>
            <div class="timeline-item"><p class="eyebrow">Keahlian</p><h3>Web · UI/UX · Visual Design</h3><p>HTML, CSS, JavaScript, desain responsif, prototyping, dan kolaborasi tim.</p></div>
          </div>
        </div>
      </section>`;
  }

  function renderLogin() {
    return `<section class="login-panel" id="top"><p class="eyebrow">Area terbatas</p><h1>Login admin</h1>
      <p>Masuk untuk mengelola karya portofolio Anda.</p>
      <form id="login-form">
        <div class="form-field"><label for="username">Username</label><input id="username" name="username" autocomplete="username" required></div>
        <div class="form-field"><label for="password">Password</label><input id="password" name="password" type="password" autocomplete="current-password" required></div>
        <p class="form-error" id="login-error" role="alert" hidden></p>
        <button class="button" type="submit">Masuk ke dashboard</button>
      </form>
     </section>`;
  }

  function initNavigation() {
    const menu = document.querySelector(".menu-toggle");
    const links = document.querySelector(".nav-links");
    menu?.addEventListener("click", () => {
      const expanded = menu.getAttribute("aria-expanded") === "true";
      menu.setAttribute("aria-expanded", String(!expanded));
      menu.setAttribute("aria-label", expanded ? "Buka menu" : "Tutup menu");
      links?.classList.toggle("open", !expanded);
    });
    const themeButton = document.querySelector(".theme-toggle");
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "dark") document.body.classList.add("dark");
    themeButton?.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem(THEME_KEY, document.body.classList.contains("dark") ? "dark" : "light");
    });
    document.querySelectorAll("[data-year]").forEach((node) => node.textContent = String(new Date().getFullYear()));
  }

  function initReveal() {
    const elements = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    elements.forEach((element) => observer.observe(element));
  }

  const page = document.body.dataset.page;
  document.querySelector("[data-site-header]").innerHTML = renderHeader(page);
  document.querySelector("[data-site-footer]").innerHTML = renderFooter();
  const app = document.querySelector("#app");
  const projects = getProjects();
  const renderers = { home: renderHome, portfolio: renderPortfolio, project: renderProject, about: renderAbout, login: renderLogin };
  if (renderers[page]) app.innerHTML = page === "about" || page === "login" ? renderers[page]() : renderers[page](projects);
  initNavigation();
  initReveal();

  if (page === "login") {
    document.querySelector("#login-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const error = document.querySelector("#login-error");
      if (form.get("username") === "admin" && form.get("password") === "porto123") {
        sessionStorage.setItem("my-porto-admin", "true");
        location.href = "admin.html";
      } else {
        error.textContent = "Username atau password tidak sesuai.";
        error.hidden = false;
      }
    });
  }

  window.MyPorto = { getProjects, saveProjects, escapeHTML, validImageURL };
})();
