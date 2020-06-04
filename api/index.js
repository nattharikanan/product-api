const express = require("express");
const router = express.Router();

module.exports = router;

router.use("/users", require("./users/users"));
router.use("/product", require("./product/product"));
router.use("/categories", require("./categories/categories"));
router.use("/carts", require("./carts/carts"));
