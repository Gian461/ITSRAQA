/* LATK Cafe — Shared Admin Components (Sidebar & Navigation) */

function renderAdminSidebar(activeTab = "") {
  const container = document.getElementById("adminSidebar");
  if (!container) return;

  const user = typeof getUser === "function" ? getUser() : null;
  const adminName = user ? (user.firstName || user.username) : "Admin";

  container.innerHTML = `
    <div class="admin-sidebar p-3 shadow" style="width:250px; min-height:100vh; flex-shrink:0;">
      <!-- Brand Logo Header -->
      <div class="d-flex align-items-center gap-2 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
        <img src="/img/logo.svg" width="42" height="42" alt="LATK Logo" />
        <div>
          <h6 class="fw-bold mb-0 text-white">LATK Admin</h6>
          <span class="small text-white-50">Portal Control</span>
        </div>
      </div>

      <!-- Navigation Links -->
      <div class="d-flex flex-column gap-1 mb-4">
        <a href="dashboard.html" class="d-flex align-items-center gap-2 ${activeTab === 'dashboard' ? 'active' : ''}">
          <span>📊</span> <span>Dashboard</span>
        </a>
        <a href="orders.html" class="d-flex align-items-center gap-2 ${activeTab === 'orders' ? 'active' : ''}">
          <span>🧾</span> <span>Orders</span>
        </a>
        <a href="inventory.html" class="d-flex align-items-center gap-2 ${activeTab === 'inventory' ? 'active' : ''}">
          <span>📦</span> <span>Inventory</span>
        </a>
        <a href="reports.html" class="d-flex align-items-center gap-2 ${activeTab === 'reports' ? 'active' : ''}">
          <span>📈</span> <span>Reports</span>
        </a>
        <a href="accounts.html" class="d-flex align-items-center gap-2 ${activeTab === 'accounts' ? 'active' : ''}">
          <span>👥</span> <span>Accounts</span>
        </a>
      </div>

      <!-- User Profile & Actions -->
      <div class="mt-auto pt-3 border-top border-secondary border-opacity-25">
        <div class="d-flex align-items-center gap-2 mb-3 px-2">
          <div class="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold" style="width:36px;height:36px;">
            ${adminName.charAt(0).toUpperCase()}
          </div>
          <div class="text-truncate">
            <div class="small fw-bold text-white">${adminName}</div>
            <span class="badge bg-warning text-dark small" style="font-size:0.65rem;">ADMINISTRATOR</span>
          </div>
        </div>
        <a href="javascript:void(0)" onclick="logout()" class="btn btn-outline-light btn-sm w-100 d-flex align-items-center justify-content-center gap-2 py-2">
          <span>🚪</span> Logout
        </a>
        <div class="text-center mt-3">
          <a href="/home.html" class="small text-white-50 text-decoration-none">← Customer Site</a>
        </div>
      </div>
    </div>`;
}
