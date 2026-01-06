// member.js - Script untuk Member Management

// Load data member saat halaman dibuka

window.addEventListener("DOMContentLoaded", async () => {
  try {
    await window.api.autoUpdateAllMember();
    loadMembers();
    initStatusFilter();
    initSearchHandler();
    console.log("Auto update member status selesai");
  } catch (err) {
    console.error("Auto update error:", err);
  }
});

// Function untuk load semua member
async function loadMembers() {
  try {
    console.log("Loading members...");
    const members = await window.api.getMember();
    console.log(members)
    members.sort((a, b) => a.id - b.id);
    console.log("Members data:", members);
    displayMembers(members);
  } catch (error) {
    console.error("Error loading members:", error);
    alert("Gagal memuat data member!");
  }
}

// Function untuk display member ke table
function displayMembers(members) {
  const tableBody = document.getElementById("memberTable");

  if (!members || members.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="px-6 py-8 text-center text-gray-500">
          <i class="fas fa-inbox text-4xl mb-2 block"></i>
          <p>Belum ada data member</p>
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = members
    .map(
      (member, index) => `
    <tr class="hover:bg-gray-50 transition">
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        ${index + 1}
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <div class="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span class="text-blue-600 font-semibold">${member.nama
              .charAt(0)
              .toUpperCase()}</span>
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-900">${member.nama}</div>
          </div>
        </div>
      </td>
      <td class="px-6 py-4 text-sm text-gray-700">
        ${member.id || "-"}
      </td>
      </td>
      <td class="px-6 py-4 text-sm text-gray-700">
        ${member.alamat || "-"}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
      ${member.no_telp || "-"}
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
          member.status
        )}">
          ${member.status}
        </span>
      </td>
      <td class="px-4 py-4 whitespace-nowrap text-center text-sm font-medium">
        <button 
          onclick="editMember(${member.id})"
          class="text-blue-600 bg-blue-100 p-4 rounded-xl hover:text-white hover:bg-blue-600 transition"
          title="Hapus"
        >
        Edit
          <i class="fas fa-edit"></i>
        </button>
        <button 
          onclick="deleteMember(${member.id}, '${member.nama}')" 
          class="text-red-600 bg-red-100 p-4 rounded-xl hover:text-red-900  transition"
          title="Hapus"
        >
        Delete
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `
    )
    .join("");
}

// Function untuk format tanggal
function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("id-ID", options);
}

// Function untuk styling kategori
function getStatusClass(status) {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Non Active":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// Function untuk delete member
async function deleteMember(id, nama) {
  if (confirm(`Apakah Anda yakin ingin menghapus member "${nama}"?`)) {
    try {
      await window.api.deleteMember(id);
      alert("Member berhasil dihapus!");
      loadMembers(); // Reload data
    } catch (error) {
      console.error("Error deleting member:", error);
      alert("Gagal menghapus member!");
    }
  }
}

// Function untuk edit member (bisa dikembangkan dengan modal)
// function editMember(id) {
//   alert(`Fitur edit untuk member ID ${id} sedang dalam pengembangan`);
//   // TODO: Implement edit functionality dengan modal atau form
// }

// Search functionality
function initSearchHandler() {
  const searchInput = document.querySelector(
    'input[placeholder="Cari member..."]'
  );
  if (!searchInput) return;

  searchInput.addEventListener("input", async (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const members = await window.api.getMember();

    const filtered = members.filter(
      (member) =>
        member.nama.toLowerCase().includes(searchTerm) ||
        member.no_telp.includes(searchTerm) ||
        member.status.toLowerCase().includes(searchTerm) ||
        (member.alamat && member.alamat.toLowerCase().includes(searchTerm))
    );

    displayMembers(filtered);
  });
}

function initStatusFilter() {
  const filter = document.getElementById("statusFilter");
  if (!filter) return;

  filter.addEventListener("change", async () => {
    applyFilters();
  });
}

async function applyFilters() {
  const searchInput = document.querySelector(
    'input[placeholder="Cari member..."]'
  );
  const filter = document.getElementById("statusFilter");

  const searchTerm = searchInput.value.toLowerCase();
  const status = filter.value;

  let members = await window.api.getMember();

  // Filter status
  if (status !== "All") {
    members = members.filter((member) => member.status === status);
  }

  // Filter search
  members = members.filter(
    (member) =>
      member.nama.toLowerCase().includes(searchTerm) ||
      member.no_telp.includes(searchTerm) ||
      member.status.toLowerCase().includes(searchTerm) ||
      (member.alamat && member.alamat.toLowerCase().includes(searchTerm))
  );

  displayMembers(members);
}
