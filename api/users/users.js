const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
module.exports = router;
let refreshToken = [];

router.post("/login", async (req, res) => {
  // let db = req.db;
  // let ids = await db("users")
  // try {
  //   if (bcrypt.compareSync(req.body.password, ids[0].password)) {
  //     return res.send({
  //       ok: true,
  //       message: 'เข้าสู่ระบบ',
  //     });
  //   } else {
  //     return res.send({
  //       ok: false,
  //       message: 'ยืนยันไม่สำเร็จ',
  //     });
  //   }
  // }catch (e) {
  //   res.send({ ok: false, error: e.message });
  // }//ใข้งานได้

  let db = req.db;
  let rows = await req.db("users").where("email", "=", req.body.email);
  if (rows.length === 0) {
    return res.send({
      ok: false,
      message: "การยืนยันตัวตนผิดพลาด",
    });
  }
  try {
    if (bcrypt.compareSync(req.body.password, rows[0].password)) {
      const token = jwt.sign(
        {
          email: rows[0].email,
          fisrtname: rows[0].firstname,
          lastname: rows[0].lastname,
          gender: rows[0].gender,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "1h",
        }
      );
      return res.send({
        ok: true,
        message: "เข้าสู่ระบบ",
        token: token,
      });
    } else {
      return res.send({
        ok: false,
        message: "ยืนยันไม่สำเร็จ",
      });
    }
  } catch (e) {
    res.send({ ok: false, error: e.message });
  } //ใข้งานได้

  // try {
  // if (!req.body.email || !bcrypt.compareSync('req.body.password', hashy)) {
  //   return res.send({
  //     ok: false,
  //     message: 'กรุณาตรวจสอบชื่อผู้ใช้งานและรหัสผ่าน',
  //   });
  // }
  // let pass = await req.db('users').select(['password']).where('password', '=', req.body.email)

  //     let db = req.db; //ประกาศใช้
  //     let ids = await db("users");
  //     let rows = await req.db('users')
  //       .where('email', '=', req.body.email || '')
  //       .where('password', '=', bcrypt.compareSync('req.body.password',ids[0].password) || '')
  //     if (rows.length === 0) {
  //       return res.send({
  //         ok: false,
  //         message: 'ชื่อผู้ใช้งานหรือรหัสผ่าน ไม่ถูกต้อง',
  //       })

  //     }

  //     let users = rows[0]

  //     // TODO: save ข้อมูลลง session
  //     // req.session.data = user
  //     req.$socket.publish('users', `${users.name} is logged in`)
  //     const jwt = require("jwt-simple"); //https://medium.com/@kennwuttisasiwat/%E0%B8%97%E0%B8%B3-authentication-%E0%B8%9A%E0%B8%99-express-%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2-passport-js-jwt-34fb1169a410
  //     const payload = {
  //       email: req.body.email,
  //       firstname: req.body.firstname,
  //       iat: new Date().getTime()//มาจากคำว่า issued at time (สร้างเมื่อ)
  //     };
  //     const SECRET = "MY_SECRET_KEY"; //ในการใช้งานจริง คีย์นี้ให้เก็บเป็นความลับ
  //     // jwt.encode(payload, SECRET)
  //     var auth = jwt.encode(payload, SECRET);

  //     res.send({
  //       ok: true,
  //       message: 'เข้าสู่ระบบสำเร็จ',
  //       users,
  //       auth
  //     })
  //   } catch (e) {
  //     res.send({ ok: false, error: e.message });
  // }
});

router.post("/register", async (req, res) => {
  let checknull = await req.db("users")
  try{
  if (req.body.firstname == null || req.body.lastname == null || req.body.email == null || req.body.password == null || req.body.phone == null) { 
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
          age: req.body.age,
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

// router.get("/me", async (req, res) => {
//   try { //เช็คauth
//     const token = req.headers.authorization.split(" ")[1];
//     console.log(token);
//     const decoded = jwt.verify(token, process.env.JWT_KEY);
//     req.userData = decoded;
//     let db = req.db;
//     let rows;
//     try {
//       if (req.query.userid) {
//         rows = await db("users")
//           .where("userid", "=", req.query.userid);
//       } else {
//         rows = await db("users");
//       }
//       res.send({
//         ok: true, // ส่ง status
//         users: rows, // ส่งค่ากลับ
//       });
//     } catch (e) {
//       res.send({ ok: false, error: e.message });
//     }

//   } catch (e) {
//     return res.status(401).json({
//       message: "Auth failed"
//     })
//   };

//            });

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




