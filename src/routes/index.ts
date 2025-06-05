import { Router } from "express"
import users from "./users"
import schedule from "./schedule"

const router = Router()

router.use("/users", users)
router.use("/schedules", schedule)

export default router