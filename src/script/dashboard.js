document.addEventListener("DOMContentLoaded" , function (){
  showStatusAccount()
})

async function countMemberStatus() {
  const members = await window.api.getMember();

  const active = members.filter(m => m.status === "Active").length;
  const nonActive = members.filter(m => m.status === "Non Active").length;

  console.log("Active:", active);
  console.log("Non Active:", nonActive);

  return { active, nonActive };
}


async function showStatusAccount(){
  const {active, nonActive} = await countMemberStatus()

  document.getElementById("member-active").innerText = `${active}`
  document.getElementById("member-non-active").innerText = `${nonActive}`


}
