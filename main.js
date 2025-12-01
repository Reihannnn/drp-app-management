const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const db = require("./database/db");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, "public/assets/image/drp_logo.jpg"),
  });

  win.loadFile("index.html");
};

// exit program
ipcMain.on("app:exit", () => {
  app.quit();
});

// MPA (open different html page )
ipcMain.on("open-page", (event, page) => {
  const win = BrowserWindow.getFocusedWindow();
  win.loadFile(page);
});

app.commandLine.appendSwitch("disable-features", "AutofillServerCommunication");

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// function auto update member status
async function autoUpdateAllMemberStatus() {
  const members = await db.allAsync(`SELECT id FROM member`);

  for (const m of members) {
    const latest = await db.getAsync(
      `SELECT end_date FROM membership 
       WHERE member_id=? 
       ORDER BY date(end_date) DESC LIMIT 1`,
      [m.id]
    );

    let newStatus = "Non Active";

    if (latest) {
      const today = new Date();
      const end = new Date(latest.end_date);

      newStatus = today <= end ? "Active" : "Non Active";
    }

    await db.runAsync(`UPDATE member SET status=? WHERE id=?`, [
      newStatus,
      m.id,
    ]);
  }

  return true;
}

// ========= HANDLE CRUD MEMBER (CREATE, READ , UPDATE , DELETE )  =============

// CREATE NEW MEMBER
ipcMain.handle("member:add", async (event, data) => {
  return await db.runAsync(
    `INSERT INTO member (nama, alamat, status, no_telp)
    VALUES (?, ?, ?, ?)`,
    [data.nama, data.alamat, data.status, data.no_telp]
  );
});

// READ / GET / SELECT MEMBER
ipcMain.handle("member:list", async () => {
  return await db.allAsync("SELECT * FROM member ORDER BY id DESC");
});

// UPDATE MEMBER
ipcMain.handle("member:update", async (event, data) => {
  return await db.runAsync(
    `UPDATE member SET nama=?, alamat=?, date=?, category=?, no_telp=? WHERE id=?`,
    [data.nama, data.alamat, data.status, data.no_telp, data.id]
  );
});

// UPDATE STATUS MEMBER
ipcMain.handle("member:autoUpdateAll", autoUpdateAllMemberStatus);

// DELETE MEMBER
ipcMain.handle("member:delete", async (event, id) => {
  return await db.runAsync(`DELETE FROM member WHERE id=?`, [id]);
});

// CHECK DUPLICATE MEMBER
ipcMain.handle("checkMemberExist", (event, nama) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM member WHERE nama = ?`, [nama], (err, row) => {
      if (err) reject(err);
      resolve(row ? true : false); // kalau ada row berarti nama sudah terdaftar
    });
  });
});

// ========= HANDLE CRUD MEMBERSHIP (CREATE, READ , UPDATE , DELETE )  =============

// CREATE MEMBERSHIP
ipcMain.handle("membership:add", async (event, data) => {
  try {
    const membership = await db.runAsync(
      `INSERT INTO membership (member_id, start_date, end_date)
       VALUES (?, ?, ?)`,
      [data.member_id, data.start_date, data.end_date]
    );

    // Auto income
    const bulan = data.start_date.substring(5, 7);
    const tahun = data.start_date.substring(0, 4);

    // RUN INCOME AFTER ADD MEMBERSHIP
    // await db.runAsync(
    //   `INSERT INTO income (member_id, amount, payment_date, bulan, tahun, keterangan)
    //    VALUES (?, ?, DATE('now'), ?, ?, ?)`,
    //   [data.member_id, data.amount, bulan, tahun, "Pembayaran membership"]
    // );

    return { success: true, id: membership.id };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// GET MEMBERSHIP

ipcMain.handle("membership:list", async () => {
  return await db.allAsync(`SELECT * FROM membership`);
});

// GET / SELECT / READ MEMBERSHIP BY MEMBER ID
ipcMain.handle("membership:listByMember", async (event, member_id) => {
  return await db.allAsync(
    `SELECT * FROM membership WHERE member_id=? ORDER BY id DESC`,
    [member_id]
  );
});

// GET ALL MEMBERSHIP WITH NAME USE MEMBER_ID
ipcMain.handle("getAllMembershipWithName:list", (event) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT 
        membership.id,
        member.nama AS name,
        membership.start_date,
        membership.end_date
      FROM membership
      JOIN member ON member.id = membership.member_id
      ORDER BY membership.id DESC
      `,
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
});

// UPDATE MEMBERSHIP
ipcMain.handle("membership:update", async (event, data) => {
  return await db.runAsync(
    `UPDATE membership SET start_date=?, end_date=? WHERE id=?`,
    [data.start_date, data.end_date, data.id]
  );
});

// DELETE MEMBERSHIP
ipcMain.handle("membership:delete", async (event, id) => {
  return await db.runAsync(`DELETE FROM membership WHERE id=?`, [id]);
});

// GET INCOME LIST
ipcMain.handle("income:list", async () => {
  return await db.allAsync(`
    SELECT income.*, member.nama 
    FROM income
    LEFT JOIN member ON income.member_id = member.id
    ORDER BY income.id DESC
  `);
});

// SEARCH MEMBER
ipcMain.handle("search-member", (event, keyword) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT id, nama FROM member WHERE nama LIKE ?`,
      [`%${keyword}%`],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
});

// if close app => also stop program ketika sedang running
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
