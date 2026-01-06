// document.addEventListener("DOMContentLoaded", () => {
//   loadMembershipTable();
//   getAllMembership();
//   initSearchHandler();

//   document.getElementById("yearFilter").addEventListener("change", () => {
//     loadMembershipTable();
//   });
// });

// async function loadMembershipTable() {
//   const selectedYear = document.getElementById("yearFilter").value;
//   const members = await window.api.getMember();
//   const tableBody = document.getElementById("memberTable");

//   const months = [
//     "january",
//     "february",
//     "maret",
//     "april",
//     "mei",
//     "juni",
//     "juli",
//     "agustus",
//     "september",
//     "october",
//     "november",
//     "desember",
//   ];

//   tableBody.innerHTML = "";

//   for (const member of members) {
//     const memberships = await window.api.listMembershipByMember(member.id);

//     // template bulan kosong
//     const monthMap = {};
//     months.forEach((m) => (monthMap[m] = { text: "----", color: "" }));

//     memberships.forEach((m) => {
//       const end = new Date(m.end_date);
//       console.log(end);
//       const endYear = end.getFullYear();

//       // ❗ Tampilkan hanya membership yang tahun end_date = filter
//       if (endYear != selectedYear) return;

//       const monthIndex = end.getMonth(); // 0-11
//       const monthName = months[monthIndex - 1];

//       const today = new Date();
//       const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
//       console.log(diffDays);

//       let color = "";
//       if (diffDays < 0) color = "bg-red";
//       else if (diffDays <= 5) color = "bg-yellow";
//       else color = "bg-green";

//       monthMap[monthName] = {
//         text: formatDate(end),
//         color,
//       };
//     });

//     const row = document.createElement("tr");
//     row.innerHTML = `
//       <td class="text-center">${member.nama}</td>
//       ${months
//         .map(
//           (m) => `
//         <td class="px-2 text-center py-2 ${monthMap[m].color}">
//           ${monthMap[m].text}
//         </td>`
//         )
//         .join("")}
//     `;

//     tableBody.appendChild(row);
//   }
// }

// function formatDate(dateObj) {
//   const m = dateObj.getMonth();
//   const d = dateObj.getDate();
//   const y = dateObj.getFullYear();
//   return `${m + 1}/${d}/${y}`;
// }

// async function getAllMembership() {
//   const members = await window.api.getAllMembership();
//   console.table(members);
// }

// function initSearchHandler() {
//   const searchInput = document.querySelector(
//     'input[placeholder="Cari member..."]'
//   );
//   if (!searchInput) return;

//   searchInput.addEventListener("input", async (e) => {
//     const searchTerm = e.target.value.toLowerCase();
//     const members = await window.api.getMember();

//     const filtered = members.filter(
//       (member) =>
//         member.nama.toLowerCase().includes(searchTerm) ||
//         member.no_telp.includes(searchTerm) ||
//         member.status.toLowerCase().includes(searchTerm) ||
//         (member.alamat && member.alamat.toLowerCase().includes(searchTerm))
//     );

//     displayMembers(filtered);
//   });
// }

let cachedMembershipRows = [];
let cachedMembers = [];

document.addEventListener("DOMContentLoaded", () => {
  loadMembershipTable();
  getAllMembership();
  initSearchHandler();

  document.getElementById("yearFilter").addEventListener("change", () => {
    loadMembershipTable();
  });
});

async function loadMembershipTable() {
  const selectedYear = document.getElementById("yearFilter").value;
  const members = await window.api.getMember();
  const tableBody = document.getElementById("memberTable");

  cachedMembers = members;
  cachedMembershipRows = [];

  const months = [
    "january",
    "february",
    "maret",
    "april",
    "mei",
    "juni",
    "juli",
    "agustus",
    "september",
    "october",
    "november",
    "desember",
  ];

  tableBody.innerHTML = "";

  // ============================
  // RENDER SEMUA MEMBER
  // ============================
  for (const member of members) {
    const memberships = await window.api.listMembershipByMember(member.id);

    // template bulan kosong
    const monthMap = {};
    months.forEach((m) => (monthMap[m] = { text: "----", color: "" }));

    memberships.forEach((m) => {
      const end = new Date(m.end_date);
      const endYear = end.getFullYear();

      if (endYear != selectedYear) return;

      const monthIndex = end.getMonth();
      const monthName = months[monthIndex];

      const today = new Date();
      const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

      let color = "";
      if (diffDays < 0) color = "bg-red";
      else if (diffDays <= 5) color = "bg-yellow";
      else color = "bg-green";

      monthMap[monthName] = {
        text: formatDate(end),
        color,
      };
    });

    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="text-center font-semibold">${member.nama}</td>
      ${months
        .map(
          (m) => `
        <td class="px-2 text-center py-2 ${monthMap[m].color}">
          ${monthMap[m].text}
        </td>`
        )
        .join("")}
    `;

    cachedMembershipRows.push({
      name: member.nama.toLowerCase(),
      rowHtml: row.innerHTML,
    });

    tableBody.appendChild(row);
  }

  // ============================
  // SETELAH SEMUA MEMBER TERISI → HITUNG TOTAL
  // ============================
  const totals = {};
  months.forEach((m) => (totals[m] = 0));

  cachedMembershipRows.forEach((r) => {
    const temp = document.createElement("tr");
    temp.innerHTML = r.rowHtml;

    const tds = temp.querySelectorAll("td");

    months.forEach((m, i) => {
      const text = tds[i + 1].textContent.trim();
      if (text !== "----") totals[m] += 1;
    });
  });

  // ============================
  // RENDER ROW TOTAL
  // ============================
  const totalRow = document.createElement("tr");
  totalRow.classList.add("bg-gray", "font-bold");

  totalRow.innerHTML = `
    <td class="text-center py-2 font-semibold">TOTAL</td>
    ${months
      .map(
        (m) => `
      <td class="text-center py-2">${totals[m]}</td>
    `
      )
      .join("")}
  `;

  tableBody.appendChild(totalRow);
}
function formatDate(dateObj) {
  const m = dateObj.getMonth() + 1;
  const d = dateObj.getDate();
  const y = dateObj.getFullYear();
  return `${m}/${d}/${y}`;
}

async function getAllMembership() {
  const members = await window.api.getAllMembership();
  console.table(members);
}

// ===============================
// 🔍 SEARCH HANDLER (FINAL)
// ===============================
function initSearchHandler() {
  const input = document.querySelector(
    'input[placeholder="Cari membership..."]'
  );
  if (!input) return;

  input.addEventListener("input", () => {
    const search = input.value.toLowerCase();
    const tableBody = document.getElementById("memberTable");

    // Jika pencarian kosong → tampilkan semua row
    if (search === "") {
      tableBody.innerHTML = cachedMembershipRows
        .map((r) => `<tr>${r.rowHtml}</tr>`)
        .join("");
      return;
    }

    // Filter berdasarkan nama
    const filtered = cachedMembershipRows.filter((r) =>
      r.name.includes(search)
    );

    // Render hasil filter
    tableBody.innerHTML = filtered.map((r) => `<tr>${r.rowHtml}</tr>`).join("");

    // Jika tidak ada hasil
    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="13" class="text-center py-4 text-gray-500">
            Tidak ada member ditemukan
          </td> 
        </tr>
      `;
    }
  });
}
