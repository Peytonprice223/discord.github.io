const router = require("express").Router();
// const roomRoutes = require("./rooms");
// const channelRoutes = require("./channels");
const userRoutes = require("./users");
// const messageRoutes = require("./messages");

// routes
// router.use("/rooms", roomRoutes);
// router.use("/channels", channelRoutes);
router.use("/users", userRoutes);
// router.use("/messages", messageRoutes);

module.exports = router;
