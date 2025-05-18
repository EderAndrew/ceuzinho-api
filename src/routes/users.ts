import { Router } from "express"
import * as controller from "../modules/users/controller"

const router = Router()

//router.get("/", controller.getAll)
router.post("/", controller.createUser)
router.get("/ping", controller.pong)

export default router