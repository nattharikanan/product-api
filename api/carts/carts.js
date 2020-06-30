const express = require("express");
const router = express.Router();
module.exports = router;

router.get("/", async (req, res) => {
  // ใช้ async function
  try {
    let db = req.db;
    let rows;
    try {
      if (req.query.class) {
        rows = await db("carts");
      } else {
        rows = await db("carts");
      }
      res.send({
        ok: true, // ส่ง status
        carts: rows, // ส่งค่ากลับ
      });
    } catch (e) {
      res.send({ ok: false, error: e.message });
    }
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    let db = req.db;
    let rows = await db("carts").insert({
      productid: req.body.productid,
      userid: req.body.userid,
      quantity: req.body.quantity,
    });
    res.send({
      ok: true,
      rows: rows,
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

router.get("/detail", async (req, res) => {
  try {
    let db = req.db;
    let rows;
    if (req.query.userid) {
      rows = await db("carts as c")
        .join("users as u", "c.userid", "u.userid")
        .join("products as p", "c.productid", "p.productid")
        .where("c.userid", "=", req.query.userid)

        .select([
          "u.firstname",
          "p.productid",
          "p.productname",
          "c.quantity",
          "p.unitprice",
        ]);
    } else {
      rows = await db("carts");
    }

    res.send({
      ok: true, // ส่ง status
      carts: rows, // ส่งค่ากลับ
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});
