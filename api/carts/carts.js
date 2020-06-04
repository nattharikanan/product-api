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
  let db = req.db;
  let ids = await db("carts").insert({
    product_id: req.body.product_id,
    pname: req.body.pname,
    cid: req.body.cid,
    price: req.body.price,
    notation: req.body.notation,
    pstatus: req.body.pstatus,
    pimage: req.body.pimage,
    quantity: req.body.quantity,
  });
  res.send({
    ok: true,
    ids: ids,
  });
});
