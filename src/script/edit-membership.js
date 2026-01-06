
document.addEventListener("DOMContentLoaded", async () => {

  const id = localStorage.getItem("edit_membership_id");

  // if(!id){
  //   alert("ID Membership tidak ditemukan");
  //   return;
  // }

  const data = await api.getMembershipById(Number(id));
  const dataMember = await api.getMemberById(Number(data.member_id))
  
  // if(!data){
    //   alert("Membership tidak ditemukan");
  //   return;
  // }


  console.log(dataMember)

  const namaMember = dataMember.nama
  const idMember = dataMember.id


  document.getElementById("start_date").value = data.start_date;
  document.getElementById("end_date").value = data.end_date;
  document.getElementById("namaMember").value = `${namaMember}, ${idMember}`;
  


  document
    .getElementById("formEditMembership")
    .addEventListener("submit", async (e) => {

      e.preventDefault();

      const payload = {
        id,
        start_date: start_date.value,
        end_date: end_date.value
      };

      const confirmUpdate = confirm("Yakin ingin update membership?");

      if(!confirmUpdate) return;


      await api.updateMembership(payload);

      await api.autoUpdateAllMember();

      alert("Membership berhasil diupdate");

      localStorage.removeItem("edit_membership_id");

      api.openPage("src/views/list_membership.html");
    });

});

function editMembership(id) {
  localStorage.setItem("edit_membership_id", id);
  api.openPage('src/views/edit_membership.html');
}
