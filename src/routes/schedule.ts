import { Router } from "express"
import * as controller from "../modules/schedule/controller"
import { verifyJWT } from "../middlewares/jwt"
import { formMiddleware } from "../lib/formMiddlware"

const router = Router()

router.post("/createSchedule", verifyJWT, formMiddleware, controller.createSchedule)
router.put("/updateSchedule", verifyJWT, controller.updateSchedule)
router.delete("/deleteSchedule", verifyJWT, controller.deleteSchedule)

export default router