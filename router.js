// document.addEventListener("DOMContentLoaded", () => {
//   const content = document.querySelector("#content");

//   // LOAD PAGE
//   async function loadPage(page) {
//     try {
//       const res = await fetch(`src/views/${page}.html`);
//       const html = await res.text();

//       content.innerHTML = html;

//       // simpan agar refresh tetap stay
//       localStorage.setItem("lastPage", page);
//     } catch (err) {
//       content.innerHTML = "<h1>Halaman tidak ditemukan.</h1>";
//     }
//   }

//   // EVENT UNTUK BUTTON NAVIGASI
//   document.addEventListener("click", (e) => {
//     const page = e.target.dataset.page;
//     if (page) loadPage(page);
//   });

//   // Saat buka aplikasi / refresh
//   const last = localStorage.getItem("lastPage");

//   if (last) {
//     loadPage(last);      // halaman terakhir
//   } else {
//     loadPage("dashboard");       // default halaman pertama
//   }
// });