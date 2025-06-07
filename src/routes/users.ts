import { Router } from "express"
import * as controller from "../modules/users/controller"
import { verifyJWT } from "../middlewares/jwt"
import { formMiddleware } from "../middlewares/formMiddlware"

const router = Router()

router.post("/signin", controller.signIn)
router.post("/signup", verifyJWT, controller.signUp)
router.get("/me", verifyJWT, controller.me)
router.get("/all", verifyJWT, controller.allUsers)
router.put("/edituser/:id", verifyJWT, formMiddleware, controller.editUser)
router.get("/ping", controller.pong)

export default router