import { Router } from "express"
import * as controller from "../modules/users/controller"
import { verifyJWT } from "../lib/jwt"

const router = Router()

router.post("/login", controller.SignIn)
router.post("/", controller.createUser)
router.get("/", verifyJWT, controller.getUser)
router.get("/ping", controller.pong)

export default router