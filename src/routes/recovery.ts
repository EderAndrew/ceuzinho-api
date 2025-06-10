import { Router } from "express"
import * as controller from "../modules/recovery/controller"
import { verifyJWT } from "../middlewares/jwt"
const router = Router()

router.post("/sendotc", verifyJWT, controller.sendotc)

export default router