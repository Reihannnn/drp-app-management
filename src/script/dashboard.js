document.addEventListener("DOMContentLoaded", function () {
  showStatusAccount();
  showGrowthRate();
  showActiveThisMonth();
  showExpiringSoon();
});

// 1. HITUNG MEMBER AKTIF & NON AKTIF
async function countMemberStatus() {
  const members = await window.api.getMember();

  const active = members.filter(m => m.status === "Active").length;
  const nonActive = members.filter(m => m.status === "Non Active").length;

  return { active, nonActive };
}

async function showStatusAccount() {
  const { active, nonActive } = await countMemberStatus();
  document.getElementById("member-active").innerText = active;
  document.getElementById("member-non-active").innerText = nonActive;
}



// 2. GROWTH RATE
async function showGrowthRate() {
  const members = await window.api.getMember();

  const now = new Date();
  const thisMonth = now.getMonth() + 1;
  const thisYear = now.getFullYear();

  const lastMonth = thisMonth === 1 ? 12 : thisMonth - 1;
  const lastMonthYear = thisMonth === 1 ? thisYear - 1 : thisYear;

  const A = members.filter(m => {
    const d = new Date(m.start_date);
    return d.getMonth() + 1 === thisMonth && d.getFullYear() === thisYear;
  }).length;

  const B = members.filter(m => {
    const d = new Date(m.start_date);
    return d.getMonth() + 1 === lastMonth && d.getFullYear() === lastMonthYear;
  }).length;

  let growth = 0;

  if (B === 0) {
    growth = A > 0 ? 100 : 0;
  } else {
    growth = ((A - B) / B) * 100;
  }

  document.getElementById("growth-rate").innerText =
    `${growth.toFixed(1)}%`;
}



// 3. MEMBERSHIP AKTIF BULAN INI
async function showActiveThisMonth() {
  const members = await window.api.getMember();

  const now = new Date();
  const monthNow = now.getMonth() + 1;
  const yearNow = now.getFullYear();

  const activeThisMonth = members.filter(m => {
    const d = new Date(m.start_date);
    return (
      m.status === "Active" &&
      d.getMonth() + 1 === monthNow &&
      d.getFullYear() === yearNow
    );
  }).length;

  document.getElementById("active-this-month").innerText = activeThisMonth;
}



// 4. EXPIRING SOON (≤ 5 HARI)
async function showExpiringSoon() {
  const members = await window.api.getMember();

  const now = new Date();
  const soon = members.filter(m => {
    const end = new Date(m.end_date);
    const diff = (end - now) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 5;
  }).length;

  document.getElementById("expiring-soon").innerText = soon;
}
