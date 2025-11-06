import { Router } from "express"
import * as controller from "../modules/recovery/controller"
import { verifyOTC } from "../middlewares/jwt"
const router = Router()

router.post("/createotc", controller.createOtc)
router.post("/otc", controller.verifyOTC)
router.put("/changePassword", verifyOTC, controller.changePasswordWithOTC)

export default router