import { Router } from "express"
import * as controller from "../modules/impediment/controller"

const router = Router()

router.post("/create", controller.createImpediment)

export default router