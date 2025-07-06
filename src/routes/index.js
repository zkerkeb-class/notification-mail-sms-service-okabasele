const express = require("express")
const router = express.Router()
const notificationRouter = require("./notification.route")

router.use("/notifications", notificationRouter)

module.exports = router
