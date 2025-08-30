import { Router } from "express"
import * as controller from "../modules/recovery/controller"
const router = Router()

router.post("/sendotc", controller.sendotc)
router.post("/otc", controller.verifyOTC)

export default router