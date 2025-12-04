const button_print_PDF_membership = document.getElementById("print-pdf-membership-button")

button_print_PDF_membership.addEventListener("click", async () => {
  const year = document.getElementById("yearFilter").value;

  const rows = [...document.querySelectorAll("#memberTable tr")];

  const tableData = rows.map(row => {
    return [...row.querySelectorAll("td")].map(td => td.innerText);
  });

  const result = await window.api.printMembershipPDF({
    year,
    tableData,
  });

  alert(result ? "PDF Membership berhasil dibuat!" : "Gagal membuat PDF!");
});
