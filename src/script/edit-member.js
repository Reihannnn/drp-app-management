window.addEventListener("DOMContentLoaded", async () => {

  const id = localStorage.getItem("edit_member_id");

  const member = await window.api.getMemberById(Number(id));

  document.getElementById("nama").value = member.nama;
  document.getElementById("alamat").value = member.alamat ?? "";
  document.getElementById("status").value = member.status;
  document.getElementById("no_telp").value = member.no_telp;

  // submit handler
  document
    .getElementById("formEditMember")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const confirmEdit = confirm("Apakah Anda yakin ingin menyimpan perubahan data member?");

      if(!confirmEdit) return 

      const data = {
        id,
        nama: nama.value,
        alamat: alamat.value,
        status: status.value,
        no_telp: no_telp.value
      };

      await window.api.updateMember(data);

      alert("Member berhasil diupdate!");

      localStorage.removeItem("edit_member_id");

      window.api.openPage("src/views/member.html");
    });
});

