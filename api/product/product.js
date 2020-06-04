const express = require("express");
const router = express.Router();
module.exports = router;
//     http://localhost:7000/api/student?class=1

// /api/product/list //โชว์ทั้งหมด
router.get("/", async (req, res) => {
  // ใช้ async function
  try {
    let db = req.db;
    let rows;
    if (req.query.categoryid) {
      rows = await db("products")
        .where("categoryid", "=", req.query.categoryid);
    }
    else if (req.query.productid) {
      rows = await db("products")
        .where("productid", "=", req.query.productid);
    }else {
      rows = await db("products");
    }
    res.send({
      ok: true, // ส่ง status
      products: rows, // ส่งค่ากลับ
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

// /api/student/แก้ไขรายชื่อ
router.post("/update", async (req, res) => { //put
  let db = req.db;
  // UPDATE products SET fname=?, lname=? WHERE id = 1
  await db("products").where({ productid: req.body.productid }).update({
    productname: req.body.productname,
    categoryid: req.body.categoryid,
    unitprice: req.body.unitprice,
    notation: req.body.notation,
    productstatus: req.body.productstatus,
    productimage: req.body.productimage,
  });
  res.send({ ok: true });
});

// /api/std/id/555
// router.get("/id/:id", async (req, res) => {
//   let db = req.db;
//   let rows = await db("student").where("id", "=", req.params.id);
//   res.send({
//     ok: true,
//     student: rows[0] || {},
//   });
// });

//   /api/student/save
// router.post("/save", async (req, res) => {
//   let db = req.db;
//   // UPDATE student SET first_name=?, last_name=? WHERE id=7
//   await db("student").where({ id: req.body.id }).update({
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//   });
//   res.send({ ok: true });
// });
//ลบข้อมูล

// router.delete("/:id", function (req, res) {
//   req
//     .db("student")
//     .where({ id: req.params.id })
//     .delete()
//     .then(() => {
//       res.send({ status: true });
//     })
//     .catch((e) => res.send({ status: false, error: e.message }));
// });
// router.post("/save2", (req, res) => {
//   let db = req.db;
//   db("t1")
//     .insert({})
//     .then((ids) => {
//       let id = ids[0];
//       Promise.all([db("t2").insert({}).catch(), db("t3").insert({}).catch()])
//         .then(() => {
//           res.send({ status: true });
//         })
//         .catch((err) => {
//           res.send({ status: false });
//         });
//     });
//   console.log("ok");
// });
// router.get("/save3", async (req, res) => {
//   try {
//     let db = req.db;
//     let ids = await db("t1").insert({});
//     await Promise.all([db("t2").insert({}), db("t3").insert({})]);
//     res.send({ status: true });
//   } catch (e) {
//     res.send({ status: false });
//   }
// });

// /api/student/delete
router.post("/delete", async (req, res) => {
  let db = req.db;
  await db("products")
    .where({ productid: req.body.productid })
    .delete()
    .then(() => {
      res.send({ status: true });
    })
    .catch((e) => res.send({ status: false, error: e.message }));
});


router.post("/insert", async (req, res) => {
  let db = req.db;
  let ids = await db("products").insert({
    productname: req.body.productname,
    unitprice: req.body.unitprice,
    categoryid: req.body.categoryid,
    notation: req.body.notation,
    productstatus: req.body.productstatus,
    productimage: req.body.productimage,
  });
  res.send({
    ok: true,
    ids: ids,
  });
}),
  // router.get("/about", function (req, res) {
  //   res.send("About birds");
  // });

  router.get("/search", async (req, res) => {
    // ใช้ async function
    try {
      let db = req.db;
      let rows;
      if (req.query.productname) {
        rows = await db("products")
          .where("productname", "like",'%'+req.query.productname+'%');
      } else {
        rows = await db("products");
      }
      res.send({
        ok: true, // ส่ง status
        products: rows, // ส่งค่ากลับ
      });
    } catch (e) {
      res.send({ ok: false, error: e.message });
    }
  });
  
