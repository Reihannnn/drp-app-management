const printExcelMembershipBtn = document.getElementById("print-excel-membership-button");

printExcelMembershipBtn.addEventListener("click", () => {
  const year = document.getElementById("yearFilter").value;

  const rows = document.querySelectorAll("#memberTable tr");

  if (rows.length === 0) {
    alert("Tabel membership kosong!");
    return;
  }

  const tableData = [];

  rows.forEach(row => {
    const cells = row.querySelectorAll("td");
    if (cells.length === 0) return;

    tableData.push(
      [...cells].map(c => c.innerText.trim() || "----")
    );
  });

  window.api.exportMembershipExcel({ year, tableData });

  alert("Sedang membuat file Excel...");
});
