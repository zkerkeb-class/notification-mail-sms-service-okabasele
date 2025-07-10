require("dotenv").config()
const express = require("express")
const cors = require("cors")
const {
  initializeMetrics,
  metricsRouter,
  metricsMiddleware
} = require("./utils/metrics")
const env = require("./config/env")
const apiRouter = require("./routes")
const errorHandling = require("./middlewares/errorHandling")
const logger = require("./middlewares/logger")

const app = express()
app.use(cors())
app.use(express.json())
app.use(logger)
// 🔧 INITIALISATION DES MÉTRIQUES
initializeMetrics("notification")

// 📊 MIDDLEWARE MÉTRIQUES
app.use(metricsMiddleware)

// 🛣️ ROUTES MÉTRIQUES
app.use(metricsRouter)
app.use("/api", apiRouter)
app.get("/", (_, res) => {
  res.send("Notification Service API")
})

app.use(errorHandling)

app.listen(env.PORT, () => {
  console.log(`Notification Service running on port ${env.PORT}`)
})
