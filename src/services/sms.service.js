const twilio = require("twilio")
const env = require("../config/env")

const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN)

async function sendSMS({ to, body }) {
  const isTestEnv =
    process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"

  const testNumber = "+18777804236"

  return client.messages.create({
    body,
    from: env.TWILIO_PHONE_NUMBER,
    to: isTestEnv ? testNumber : to
  })
}

module.exports = { sendSMS }
