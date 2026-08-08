/* LATK Cafe — Shared Frontend Components (Navbar & Footer) */

function renderNavbar(activeTab = "") {
  const container = document.getElementById("navbar");
  if (!container) return;

  const user = typeof getUser === "function" ? getUser() : null;

  const userControlHTML = user
    ? `
      <div class="dropdown">
        <button class="btn btn-maroon dropdown-toggle d-flex align-items-center gap-2 px-3 py-1" data-bs-toggle="dropdown">
          <span>${user.firstName || user.username}</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow">
          <li><a class="dropdown-item ${activeTab === 'orders' ? 'active' : ''}" href="order-status.html">My Orders</a></li>
          ${user.isAdmin ? '<li><a class="dropdown-item" href="/admin/dashboard.html">Admin Dashboard</a></li>' : ''}
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="#" onclick="logout()">Logout</a></li>
        </ul>
      </div>`
    : `<a href="login.html" class="btn btn-maroon px-4 py-1">Sign In</a>`;

  container.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark navbar-latk px-4">
      <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center gap-2" href="home.html">
          <img src="img/logo.svg" width="42" height="42" alt="LATK Logo" />
          <span class="fw-bold fs-5">Lolo And The Kids</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navMenu">
          <div class="ms-auto d-flex align-items-center gap-4">
            <a href="menu.html" class="text-white text-decoration-none fw-semibold ${activeTab === 'menu' ? 'border-bottom border-2 border-warning pb-1' : ''}">Menu</a>
            <a href="about.html" class="text-white text-decoration-none fw-semibold ${activeTab === 'about' ? 'border-bottom border-2 border-warning pb-1' : ''}">About Us</a>
            <a href="contact.html" class="text-white text-decoration-none fw-semibold ${activeTab === 'contact' ? 'border-bottom border-2 border-warning pb-1' : ''}">Contact Us</a>
            ${userControlHTML}
          </div>
        </div>
      </div>
    </nav>`;
}

function renderFooter() {
  const container = document.getElementById("footer");
  if (!container) return;

  container.innerHTML = `
    <footer class="bg-dark text-white pt-5 pb-4 mt-auto border-top border-secondary">
      <div class="container">
        <div class="row g-4">
          <!-- Brand Info -->
          <div class="col-md-5">
            <div class="d-flex align-items-center gap-2 mb-3">
              <img src="img/logo.svg" width="40" height="40" alt="LATK Logo" />
              <strong class="fs-5">Lolo And The Kids Cafe</strong>
            </div>
            <p class="text-white-50 small leading-relaxed pe-md-4 mb-3">
              Grilled favorites, unli-rice meals, tender steaks, and handcrafted specialty coffee & matcha beverages. Quality food prepared with care.
            </p>
            <p class="text-white-50 small mb-0 d-flex align-items-start gap-2">
              <span>📍</span>
              <span>1315 Sto Sepulcro Paco, Manila, Philippines, 1007</span>
            </p>
          </div>

          <!-- Quick Navigation -->
          <div class="col-md-3">
            <h6 class="fw-bold mb-3 text-warning">Quick Links</h6>
            <ul class="list-unstyled small mb-0 d-flex flex-column gap-2">
              <li><a href="home.html" class="text-white-50 text-decoration-none hover-white">Home</a></li>
              <li><a href="menu.html" class="text-white-50 text-decoration-none hover-white">Menu & Ordering</a></li>
              <li><a href="about.html" class="text-white-50 text-decoration-none hover-white">About Us</a></li>
              <li><a href="contact.html" class="text-white-50 text-decoration-none hover-white">Contact Us</a></li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div class="col-md-4">
            <h6 class="fw-bold mb-3 text-warning">Contact info</h6>
            <div class="d-flex flex-column gap-2 small mb-3">
              <div class="d-flex align-items-center gap-2">
                <span>📷</span>
                <a href="https://instagram.com/loloandthekids.cafe" target="_blank" class="text-white-50 text-decoration-none hover-white">Loloandthekids.cafe</a>
              </div>
              <div class="d-flex align-items-center gap-2">
                <span>✉️</span>
                <a href="mailto:latkcafe@gmail.com" class="text-white-50 text-decoration-none hover-white">latkcafe@gmail.com</a>
              </div>
            </div>
            <a href="/admin/login.html" class="small text-white-50 text-decoration-underline">Admin Portal Login</a>
          </div>
        </div>

        <hr class="border-secondary my-4 opacity-50" />

        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center small text-white-50">
          <div>© ${new Date().getFullYear()} Lolo And The Kid (LATK) Cafe. All rights reserved.</div>
          <div class="mt-2 mt-md-0">Made with ❤️ for great food & coffee</div>
        </div>
      </div>
    </footer>`;
}
