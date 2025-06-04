import { Router } from "express"
import users from "./users"
import schedules from "./schedule"

const router = Router()

router.use("/users", users)
router.use("/schedule", schedules)

export default router