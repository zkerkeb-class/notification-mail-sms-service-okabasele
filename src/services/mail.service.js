const nodemailer = require("nodemailer")
const env = require("../config/env")

const transporter = nodemailer.createTransport({
  host: env.MAILPIT_HOST,
  port: env.MAILPIT_PORT
})

async function sendMail({ to, subject, html }) {
  return transporter.sendMail({
    from: `SonataAI <no-reply@sonataai.com>`,
    to,
    subject,
    html
  })
}

module.exports = { sendMail }
