const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
module.exports = router;
let refreshToken = [];

router.post("/login", async (req, res) => {
  let db = req.db;
  
  let rows = await req.db("users").where("email", "=", req.body.email);
  if (rows.length === 0) {
    return res.send({
      ok: false,
      message: "การยืนยันตัวตนผิดพลาด",
    });
  }
  try {
    if( (bcrypt.compareSync(req.body.password, rows[0].password)) && rows[0].status == "user") {
      const token = jwt.sign(
        {
          email: rows[0].email,
          fisrtname: rows[0].firstname,
          lastname: rows[0].lastname,
          gender: rows[0].gender,
          status:rows[0].status
        },
        process.env.JWT_KEY,
        {
          expiresIn: "1h",
        }
      );
      return res.send({
        ok: true,
        message: "เข้าสู่ระบบ User",
        token: token,
      });
    }
    if( (bcrypt.compareSync(req.body.password, rows[0].password)) && rows[0].status == "admin") {
      const token = jwt.sign(
        {
          email: rows[0].email,
          fisrtname: rows[0].firstname,
          lastname: rows[0].lastname,
          gender: rows[0].gender,
          status:rows[0].status
        },
        process.env.JWT_KEY,
        {
          expiresIn: "1h",
        }
      );
      return res.send({
        ok: true,
        message: "เข้าสู่ระบบ Admin",
        token: token,
      });
    }
    else {
      return res.send({
        ok: false,
        message: "ยืนยันไม่สำเร็จ",
      });
    }
  } catch (e) {
    res.send({ ok: false, error: e.message });
  } //ใข้งานได้

});

// router.post("/checkcaptcha", async (req, res) => {
//   if (req.body.captcha === null || req.body.captcha === '' || req.body.captcha === undefined) {

//     return res.send({
//       ok: false,
//       message: "ยืนยัน captcha ไม่ถูกต้อง",
//     });

//   } else { 
//     const query = stringify({
//       secret: process.env.secretKey,
//       response: req.body.captcha,
//       remoteip: req.connection.remoteAddress
//     });
//     const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;
//   }

// })


router.post("/register", async (req, res) => {
  let checknull = await req.db("users")
  //ส่วน captcha
  

  try{
  if (req.body.firstname === null || req.body.lastname === null || req.body.email === null || req.body.password === null || req.body.email === ""|| req.body.password === "") { 
    return res.send({
      ok: false,
      message: "กรุณากรอกข้อมูลให้ครบถ้วน",
    });
  }
  
} catch (e) {
  res.send({ ok: false, error: e.message });
}
  try {
    let rows = await req.db("users").where("email", "=", req.body.email); //emailที่ดึงมา ไม่ซ้ำ
    if (rows.length === 0) {
      //ตรวจจากความยาวแล้วไม่ซ้ำ
      let statususer = "user"
      try {
        const hash = bcrypt.hashSync(req.body.password, 10); //เข้ารหัส
        let db = req.db;
        let ids = await db("users").insert({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          gender: req.body.gender,
          email: req.body.email,
          password: hash,
          phone: req.body.phone,
          address:req.body.address,
          age: req.body.age,
          status:statususer
        });
        return res.send({
          ok: true,
          message: "ลงทะเบียนได้",
          ids,
        });
      } catch (e) {
        res.send({ ok: false, error: e.message });
      }
    } else {
      return res.send({
        ok: false, 
        message: "email ซ้ำ",
      });
    }
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});


router.get("/me", async (req, res) => {
  try {
    //เช็คauth
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    console.log(req.userData.email);
    let db = req.db;
    let rows;
    userData = await req.db("users").where("email", "=", req.userData.email);
    console.log(userData);
    try {
      if (userData.length >= 1) {
        res.json({
          userData,
        });
      } else {
        return res.status(401).json({
          message: "ไม่ถูกต้อง",
        });
      }
    } catch (e) {
      res.send({ ok: false, error: e.message });
    }
  } catch (e) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
});

router.get("/", async (req, res) => {
  // ใช้ async function
  try {
    let db = req.db;
    let rows;
    if (req.query.userid) {
      rows = await db("users")
      .where("userid", "=", req.query.userid);
    }
    else {
      rows = await db("users");
    }
    res.send({
      ok: true, // ส่ง status
      users: rows, // ส่งค่ากลับ
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});
