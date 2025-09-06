const { sendMail } = require("./mail.service")
const { sendSMS } = require("./sms.service")
const env = require("../config/env")
const crypto = require("crypto")

const DB_URL = env.DATABASE_SERVICE_URL

async function createNotification({
  userId,
  type,
  channel,
  to,
  content,
  consent,
  meta
}) {
  let unsubscribeToken = undefined
  if (type === "email") {
    unsubscribeToken = crypto.randomBytes(24).toString("hex")
  }
  const notification = {
    userId,
    type,
    channel,
    to,
    content,
    consent,
    unsubscribeToken,
    meta,
    status: "pending"
  }
  // Persist notification in DB service
  const res = await fetch(`${DB_URL}/notifications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(notification)
  })
  if (!res.ok) throw new Error("Erreur lors de la création de la notification")
  return await res.json()
}

async function sendNotification(notification) {
  try {
    if (!notification.consent)
      throw new Error("User did not consent to notifications")
    let result
    if (notification.type === "email") {
      result = await sendMail({
        to: notification.to,
        subject: notification.meta.subject,
        html: notification.content
      })
    } else if (notification.type === "sms") {
      result = await sendSMS({
        to: notification.to,
        body: notification.content
      })
    }
    // Update status in DB
    await updateNotificationStatus(notification._id, "sent")
    return result
  } catch (err) {
    await updateNotificationStatus(notification._id, "failed", err.message)
    throw err
  }
}

async function updateNotificationStatus(id, status, error) {
  const res = await fetch(`${DB_URL}/notifications/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(error ? { status, error } : { status })
  })
  if (!res.ok) throw new Error("Erreur lors de la mise à jour du statut")
  return await res.json()
}

module.exports = {
  createNotification,
  sendNotification,
  updateNotificationStatus
}
