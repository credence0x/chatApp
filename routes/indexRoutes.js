
const router = require("express").Router(),
    userRoutes = require("./userRoutes"),
    homeRoutes = require("./homeRoutes"),
    privateMessageRoutes = require("./privateMessageRoutes"),
    publicMessageRoutes = require("./publicMessageRoutes"),
    errorRoutes = require("./errorRoutes");
router.use("/private", privateMessageRoutes);
router.use("/public", publicMessageRoutes);
router.use("/", homeRoutes);
router.use("/", errorRoutes);
module.exports = router;


