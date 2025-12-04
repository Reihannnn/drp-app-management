const printExcelBtn = document.getElementById("print-excel-member-button");
const statusFilter = document.getElementById("statusFilter");

printExcelBtn.addEventListener("click", async function () {
  const allMembers = await window.api.getMember();

  let filteredMembers = allMembers;

  if (statusFilter.value === "Active") {
    filteredMembers = allMembers.filter((m) => m.status === "Active");
  } else if (statusFilter.value === "Non Active") {
    filteredMembers = allMembers.filter((m) => m.status === "Non Active");
  }

  if (filteredMembers.length === 0) {
    alert("Tidak ada data yang bisa diexport!");
    return;
  }

  const exportData = filteredMembers.map((m) => ({
    ID: m.id,
    Nama: m.nama,
    Alamat: m.alamat,
    No_Telp: m.no_telp,
    Status: m.status,
  }));
  const dateNow = new Date();
  const year = dateNow.getFullYear(); // Tahun
  const month = dateNow.getMonth() + 1; // Bulan (0–11 → tambah 1)
  const day = dateNow.getDate();

  const formatDateNow = `${month}-${day}-${year}`

  const fileName = `Member-${statusFilter.value}-${formatDateNow}.xlsx`;
  

  // KIRIM KE PRELOAD → MAIN
  window.api.exportExcel(exportData, fileName);

  alert(`Sedang membuat file: ${fileName}`);
});
