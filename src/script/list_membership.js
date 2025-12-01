let cachedMembershipRows = []; // untuk search

// ==============================
//  LOAD MEMBERSHIP
// ==============================
async function loadMembershipTable() {
  const memberships = await window.api.getAllMembershipWithName();
  // Contoh response: [{ id, name, start_date, end_date }]
  console.log(memberships);

  cachedMembershipRows = memberships.map((m) => ({
    id: m.id,
    name: m.name.toLowerCase(),
    rowHtml: `
      <td class="px-6 py-4 text-center">${m.id}</td>
      <td class="px-6 py-4 text-center">${m.name}</td>
      <td class="px-6 py-4 text-center">${m.start_date}</td>
      <td class="px-6 py-4 text-center">${m.end_date}</td>
      <td class="px-6 py-4 text-center">
        <button 
          onclick="deleteMembership(${m.id})" 
          class=" text-red-600 px-3 py-1 rounded-lg transition hover:cursor-pointer"
        >
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `,
  }));

  renderMembershipTable(cachedMembershipRows);
  initSearchHandler();
}

// ==============================
//  RENDER TABLE
// ==============================
function renderMembershipTable(rows) {
  const tableBody = document.getElementById("listmembershipTable");

  tableBody.innerHTML = rows.map((r) => `<tr>${r.rowHtml}</tr>`).join("");
}

// ==============================
//  DELETE MEMBERSHIP
// ==============================
async function deleteMembership(id) {
  const confirmDelete = confirm("Yakin ingin menghapus membership?");
  console.log(id)
  if (!confirmDelete) return;

  const result = await window.api.deleteMembership(id);

  if (result) {
    alert("Membership berhasil dihapus!");

    // update cache
    cachedMembershipRows = cachedMembershipRows.filter((r) => r.id !== id);

    // render ulang
    renderMembershipTable(cachedMembershipRows);
  } else {
    alert("Gagal menghapus membership");
  }
}

// ==============================
//  SEARCH HANDLER (punyamu)
// ==============================
function initSearchHandler() {
  const input = document.querySelector(
    'input[placeholder="Cari membership..."]'
  );
  if (!input) return;

  input.addEventListener("input", () => {
    const search = input.value.toLowerCase();

    if (search === "") {
      renderMembershipTable(cachedMembershipRows);
      return;
    }

    const filtered = cachedMembershipRows.filter((r) =>
      r.name.includes(search)
    );

    if (filtered.length === 0) {
      document.getElementById("listmembershipTable").innerHTML = `
        <tr>
          <td colspan="5" class="text-center py-4 text-gray-500">
            Tidak ada member ditemukan
          </td>
        </tr>
      `;
      return;
    }

    renderMembershipTable(filtered);
  });
}

// ==============================
//  AUTO LOAD SAAT HALAMAN SIAP
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  loadMembershipTable();
});
