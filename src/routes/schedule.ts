import { Router } from "express"
import * as controller from "../modules/schedule/controller"
import { verifyJWT } from "../lib/jwt"

const router = Router()

router.post("/create", controller.createSchedule)
router.put("/update", verifyJWT, controller.updateSchedule)
router.delete("/delete", verifyJWT, controller.deleteSchedule)

export default router