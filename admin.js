(() => {
  const app = document.querySelector("#app");
  if (sessionStorage.getItem("my-porto-admin") !== "true") {
    location.replace("login.html");
    return;
  }

  let editingId = null;
  const escapeHTML = window.MyPorto.escapeHTML;
  const imageURL = window.MyPorto.validImageURL;

  function render() {
    const projects = window.MyPorto.getProjects();
    app.innerHTML = `<section class="container admin-main" id="top">
      <div class="admin-top"><div><p class="eyebrow">Kelola konten</p><h1>Dashboard admin</h1></div>
        <button class="button secondary small" id="logout" type="button">Keluar</button>
      </div>
      <p class="form-note">Perubahan tersimpan di browser ini saja. Gunakan layanan backend/database untuk mengelola konten secara aman di situs publik.</p>
      <div class="admin-layout">
        <section class="admin-panel"><h2 id="form-title">Tambah portofolio</h2>
          <form id="project-form">
            <div class="form-field"><label for="title">Judul proyek</label><input id="title" name="title" maxlength="80" required></div>
            <div class="form-field"><label for="category">Kategori</label><input id="category" name="category" maxlength="50" placeholder="Web Design" required></div>
            <div class="form-field"><label for="year">Tahun</label><input id="year" name="year" maxlength="10" placeholder="2025"></div>
            <div class="form-field"><label for="cover">URL gambar sampul</label><input id="cover" name="cover" type="url" placeholder="https://..." required></div>
            <div class="form-field"><label for="gallery">URL gambar detail (satu URL per baris)</label><textarea id="gallery" name="gallery" placeholder="https://..."></textarea></div>
            <div class="form-field"><label for="description">Deskripsi</label><textarea id="description" name="description" maxlength="1000" required></textarea></div>
            <p class="form-error" id="admin-error" role="alert" hidden></p>
            <button class="button" id="save-project" type="submit">Simpan portofolio</button>
            <button class="button secondary" id="cancel-edit" type="button" hidden>Batal edit</button>
          </form>
        </section>
        <section class="admin-panel"><h2>Daftar portofolio <span id="project-count"></span></h2><div class="admin-list" id="admin-list"></div></section>
      </div>
    </section>`;
    renderList(projects);
    document.querySelector("#project-form").addEventListener("submit", save);
    document.querySelector("#cancel-edit").addEventListener("click", resetForm);
    document.querySelector("#logout").addEventListener("click", () => {
      sessionStorage.removeItem("my-porto-admin");
      location.href = "login.html";
    });
  }

  function renderList(projects) {
    const list = document.querySelector("#admin-list");
    document.querySelector("#project-count").textContent = `(${projects.length})`;
    list.innerHTML = projects.length ? projects.map((project) => {
      const cover = imageURL(project.cover);
      return `<article class="admin-item">
        <img src="${escapeHTML(cover)}" alt="" loading="lazy">
        <h3>${escapeHTML(project.title)}</h3>
        <div class="admin-item-actions">
          <button class="text-button" type="button" data-edit="${escapeHTML(project.id)}">Edit</button>
          <button class="text-button danger" type="button" data-delete="${escapeHTML(project.id)}">Hapus</button>
        </div>
      </article>`;
    }).join("") : '<p class="empty-state">Belum ada proyek.</p>';
    list.querySelectorAll("[data-edit]").forEach((button) => button.addEventListener("click", () => edit(button.dataset.edit)));
    list.querySelectorAll("[data-delete]").forEach((button) => button.addEventListener("click", () => remove(button.dataset.delete)));
  }

  function save(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const cover = imageURL(form.get("cover"));
    const gallery = String(form.get("gallery") || "").split(/\r?\n/).map((url) => url.trim()).filter(Boolean);
    const error = document.querySelector("#admin-error");
    if (!cover || gallery.some((url) => !imageURL(url))) {
      error.textContent = "Gunakan URL gambar yang valid dengan protokol http:// atau https://.";
      error.hidden = false;
      return;
    }
    const projects = window.MyPorto.getProjects();
    const project = {
      id: editingId || `${slugify(form.get("title"))}-${Date.now()}`,
      title: String(form.get("title")).trim(),
      category: String(form.get("category")).trim(),
      year: String(form.get("year")).trim(),
      cover,
      gallery: gallery.map(imageURL),
      description: String(form.get("description")).trim()
    };
    const updated = editingId
      ? projects.map((item) => item.id === editingId ? project : item)
      : [project, ...projects];
    try {
      window.MyPorto.saveProjects(updated);
      render();
    } catch (storageError) {
      error.textContent = `Gagal menyimpan perubahan: ${storageError.message}`;
      error.hidden = false;
    }
  }

  function edit(id) {
    const project = window.MyPorto.getProjects().find((item) => item.id === id);
    if (!project) return;
    editingId = id;
    const form = document.querySelector("#project-form");
    form.elements.title.value = project.title || "";
    form.elements.category.value = project.category || "";
    form.elements.year.value = project.year || "";
    form.elements.cover.value = project.cover || "";
    form.elements.gallery.value = Array.isArray(project.gallery) ? project.gallery.join("\n") : "";
    form.elements.description.value = project.description || "";
    document.querySelector("#form-title").textContent = "Edit portofolio";
    document.querySelector("#save-project").textContent = "Simpan perubahan";
    document.querySelector("#cancel-edit").hidden = false;
    document.querySelector("#admin-error").hidden = true;
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function remove(id) {
    const project = window.MyPorto.getProjects().find((item) => item.id === id);
    if (!project || !window.confirm(`Hapus "${project.title}" dari daftar portofolio?`)) return;
    try {
      window.MyPorto.saveProjects(window.MyPorto.getProjects().filter((item) => item.id !== id));
      render();
    } catch (error) {
      const message = document.createElement("p");
      message.className = "form-error";
      message.setAttribute("role", "alert");
      message.textContent = `Gagal menghapus portofolio: ${error.message}`;
      document.querySelector(".admin-top").after(message);
    }
  }

  function resetForm() {
    editingId = null;
    document.querySelector("#project-form").reset();
    document.querySelector("#form-title").textContent = "Tambah portofolio";
    document.querySelector("#save-project").textContent = "Simpan portofolio";
    document.querySelector("#cancel-edit").hidden = true;
    document.querySelector("#admin-error").hidden = true;
  }

  function slugify(value) {
    return String(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "proyek";
  }

  render();
})();
