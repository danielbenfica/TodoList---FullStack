const router = require("express").Router()

//Task router
const taskRouter = require("./tasks")

router.use("/", taskRouter)

module.exports = router