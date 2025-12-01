const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  // EXIT APP
  exitApp: () => ipcRenderer.send("app:exit"),

  // MEMBER
  addMember: (data) => ipcRenderer.invoke("member:add", data),
  getMember: () => ipcRenderer.invoke("member:list"),
  updateMember: (data) => ipcRenderer.invoke("member:update", data),
  deleteMember: (id) => ipcRenderer.invoke("member:delete", id),
  // UPDATE STATUS MEMBER
  autoUpdateAllMember: () => ipcRenderer.invoke("member:autoUpdateAll"),

  // CHECK MEMBER EXIST 
  checkMemberExist: (nama) => ipcRenderer.invoke("checkMemberExist", nama),

  // MEMBERSHIP
  addMembership: (data) => ipcRenderer.invoke("membership:add", data),
  getAllMembership: () => ipcRenderer.invoke("membership:list"),
  //GET ALL MEMBERSHIP USE NAME 
  getAllMembershipWithName: () => ipcRenderer.invoke("getAllMembershipWithName:list"),
  listMembershipByMember: (id) =>
    ipcRenderer.invoke("membership:listByMember", id),
  updateMembership: (data) => ipcRenderer.invoke("membership:update", data),
  deleteMembership: (id) => ipcRenderer.invoke("membership:delete", id),

  // SEARCH
  searchMember: (keyword) => ipcRenderer.invoke("search-member", keyword),

  // INCOME
  listIncome: () => ipcRenderer.invoke("income:list"),

  // chnage DIFFERENT PAGE
  openPage: (page) => ipcRenderer.send("open-page", page),
});
