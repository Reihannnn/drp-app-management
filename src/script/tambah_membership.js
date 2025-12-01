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

const namaMember = document.getElementById("namaMember");
const suggestionBox = document.getElementById("suggestionBox");

let selectedMemberId = null;
let selectedMemberName = null

namaMember.addEventListener("input", async function (e) {
  const keyword = e.target.value.trim();

  suggestionBox.innerHTML = "";
  suggestionBox.classList.add("hidden");

  if (keyword.length < 1) return;

  const result = await window.api.searchMember(keyword);

  if (!result || result.length === 0) return;

  // tampilkan dropdown
  suggestionBox.classList.remove("hidden");

  result.forEach((member) => {
    const item = document.createElement("div");
    item.className =
      "p-6 cursor-pointer hover:bg-blue-100 transition border-b border-gray-200";

    item.textContent = `${member.nama}, id : ${member.id}`;

    item.addEventListener("click", () => {
      namaMember.value = member.nama;
      selectedMemberId = member.id;
      selectedMemberName = member.nama

      // sembunyikan dropdown
      suggestionBox.classList.add("hidden");
    });

    suggestionBox.appendChild(item);
  });
});

const formAddMembership = document.getElementById("formAddMembership")

formAddMembership.addEventListener("submit" ,async(e) =>{
  e.preventDefault()

  const memberData = {
    member_id :  selectedMemberId, 
    start_date : document.getElementById("start_date").value, 
    end_date : document.getElementById("end_date").value 
  }

  try {
    await window.api.addMembership(memberData);
    niceAlert(`Data membership nama : ${selectedMemberName} id ke : ${selectedMemberId} berhasil ditambahkan!`);
    console.log("membership berhasil ditambahkan");
    formAddMembership.reset(); 
    // loadMembers(); // Reload data
  } catch (error) {
    console.error("Error tambah member:", error);
    failAlert("Gagal menambahkan membership!");
  }
})