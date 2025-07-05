const express = require("express")
const router = express.Router()
const notificationController = require("../controllers/notification.controller")

router.post("/email/registration", notificationController.sendRegistrationEmail)
router.post(
  "/email/password-reset",
  notificationController.sendPasswordResetCode
)
router.post("/sms/registration", notificationController.sendRegistrationSMS)
router.post("/sms/password-reset", notificationController.sendPasswordResetSMS)

module.exports = router
