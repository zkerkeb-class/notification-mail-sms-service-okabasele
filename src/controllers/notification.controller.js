const notificationService = require("../services/notification.service")
const env = require("../config/env")

// Utilitaire RGPD: lien de désinscription
function getUnsubscribeLink(token) {
  return `${env.RGPD_UNSUBSCRIBE_URL}?token=${token}`
}

exports.sendRegistrationEmail = async (req, res) => {
  try {
    const { userId, email, consent } = req.body
    if (!consent) return res.status(403).json({ error: "Consentement requis" })
    const content = `<p>Bienvenue ! Merci de confirmer votre adresse e-mail.</p>`
    const notification = await notificationService.createNotification({
      userId,
      type: "email",
      channel: "registration",
      to: email,
      content:
        content +
        `<br><a href='${getUnsubscribeLink("__TOKEN__")}' style='font-size:12px'>Se désinscrire</a>`,
      consent,
      meta: { subject: "Confirmation d'inscription" }
    })
    await notificationService.sendNotification(notification)
    res.json({ success: true, notificationId: notification._id })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

exports.sendPasswordResetCode = async (req, res) => {
  try {
    const { userId, email, code, consent } = req.body
    if (!consent) return res.status(403).json({ error: "Consentement requis" })
    const content = `<p>Votre code de réinitialisation : <b>${code}</b></p>`
    const notification = await notificationService.createNotification({
      userId,
      type: "email",
      channel: "password_reset",
      to: email,
      content:
        content +
        `<br><a href='${getUnsubscribeLink("__TOKEN__")}' style='font-size:12px'>Se désinscrire</a>`,
      consent,
      meta: { subject: "Code de réinitialisation" }
    })
    await notificationService.sendNotification(notification)
    res.json({ success: true, notificationId: notification._id })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

exports.sendRegistrationSMS = async (req, res) => {
  try {
    const { userId, phone, consent } = req.body
    if (!consent) return res.status(403).json({ error: "Consentement requis" })
    const content = `Bienvenue chez SonataAI ! Merci de confirmer votre numéro.`
    const notification = await notificationService.createNotification({
      userId,
      type: "sms",
      channel: "registration",
      to: phone,
      content,
      consent
    })
    await notificationService.sendNotification(notification)
    res.json({ success: true, notificationId: notification._id })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

exports.sendPasswordResetSMS = async (req, res) => {
  try {
    const { userId, phone, code, consent } = req.body
    if (!consent) return res.status(403).json({ error: "Consentement requis" })
    const content = `Votre code de réinitialisation SonataAI : ${code}`
    const notification = await notificationService.createNotification({
      userId,
      type: "sms",
      channel: "password_reset",
      to: phone,
      content,
      consent
    })
    await notificationService.sendNotification(notification)
    res.json({ success: true, notificationId: notification._id })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}
