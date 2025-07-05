/**@function
 * Logger middleware to log request details and response time
 */
const loggerMiddleware = (req, res, next) => {
  const start = Date.now()
  res.on("finish", () => {
    const duration = Date.now() - start
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    )
  })
  next()
}

module.exports = loggerMiddleware
