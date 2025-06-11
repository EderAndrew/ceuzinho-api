import { Router } from "express"
import * as controller from "../modules/schedule/controller"
import { verifyJWT } from "../middlewares/jwt"
import { formMiddleware } from "../middlewares/formMiddlware"

const router = Router()

router.post("/createSchedule", verifyJWT, formMiddleware, controller.createSchedule)
router.get("/schedules/:date", verifyJWT, controller.allSchedulesByDate)
router.put("/updateSchedule/:id", verifyJWT, formMiddleware, controller.updateSchedule)
router.get("/schedule/:id", verifyJWT, controller.scheduleById)
router.get("/scheduleUser/:id", verifyJWT, controller.scheduleByUserId)
router.delete("/deleteSchedule", verifyJWT, controller.deleteSchedule)
router.put("/changeTeacher/:scheduleId", verifyJWT, controller.changeScheduleTeacherId)

export default router