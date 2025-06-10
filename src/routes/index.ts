import { Router } from "express"
import users from "./users"
import schedule from "./schedule"
import impediment from "./impediment"
import recovery from "./recovery"

const router = Router()

router.use("/users", users)
router.use("/schedules", schedule)
router.use("/impediments", impediment)
router.use("/recovery", recovery)

export default router