// BASE STYLE — hanya sekali dipakai
const style = document.createElement("style");
style.textContent = `
  .simple-alert {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 18px;
    border-radius: 8px;
    font-size: 14px;
    opacity: 0;
    transform: translateY(-10px);
    transition: all .25s ease;
    z-index: 9999;
    color: white;
  }

  .simple-alert.show {
    opacity: 1;
    transform: translateY(0);
  }

  /* warna hijau */
  .simple-alert.success {
    background: #4CAF50;
  }

  /* warna merah */
  .simple-alert.error {
    background: #F44336;
  }
`;
document.head.appendChild(style);


// ALERT BERHASIL — warna hijau
function niceAlert(message, duration = 2500) {
  const el = document.createElement("div");
  el.className = "simple-alert success";
  el.textContent = message;

  document.body.appendChild(el);
  setTimeout(() => el.classList.add("show"), 50);

  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 250);
  }, duration);
}


// ALERT GAGAL — warna merah
function failAlert(message, duration = 2500) {
  const el = document.createElement("div");
  el.className = "simple-alert error";
  el.textContent = message;

  document.body.appendChild(el);
  setTimeout(() => el.classList.add("show"), 50);

  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 250);
  }, duration);
}

const form = document.getElementById("formAddMember");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const memberData = {
    nama: document.getElementById("nama").value,
    alamat: document.getElementById("alamat").value,
    status: document.getElementById("status").value,
    no_telp: document.getElementById("no_telp").value,
  };

  const isExistMember = await window.api.checkMemberExist(memberData.nama);

  if(isExistMember){
    failAlert("Member Sudah terdaftar")
    return
  }

  try {
    await window.api.addMember(memberData);
    niceAlert("Data member berhasil ditambahkan!");
    console.log("member berhasil ditambahkan");
    form.reset(); 
    // loadMembers(); // Reload data
  } catch (error) {
    console.error("Error tambah member:", error);
    alert("Gagal menambahkan member!");
  }
});
