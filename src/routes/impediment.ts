import { Router } from "express"
import * as controller from "../modules/impediment/controller"
import { verifyJWT } from "../middlewares/jwt"

const router = Router()

router.post("/createImpediment/:userId", verifyJWT, controller.createImpediment)
router.put("/updateImpediment/:id", verifyJWT, controller.updateImpediment)
router.get("/impediment/:id", verifyJWT, controller.selectImpediment)
router.get("/impediments", verifyJWT, controller.allImpediments)
router.delete("/removeImpediment/:id", verifyJWT, controller.removeImpediment)

export default router