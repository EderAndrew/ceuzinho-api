import { Router } from "express"
import * as controller from "../modules/impediment/controller"
import { verifyJWT } from "../middlewares/jwt"

const router = Router()

router.post("/create/:userId", verifyJWT, controller.createImpediment)

export default router