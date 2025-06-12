import { Router } from "express"
import * as controller from "../modules/users/controller"
import { verifyJWT } from "../middlewares/jwt"
import { formMiddleware } from "../middlewares/formMiddlware"
import { verifyOTC } from "../modules/recovery/controller"

const router = Router()

router.post("/signin", controller.signIn)
router.post("/signup", verifyJWT, controller.signUp)
router.get("/me", verifyJWT, controller.me)
router.get("/all", verifyJWT, controller.allUsers)
router.put("/edituser/:id", verifyJWT, formMiddleware, controller.editUser)
router.put("/disable/:id", verifyJWT, controller.disableUser)
router.put("/changePassword", verifyOTC, controller.changePassword)
router.put("/updateimage/:id", verifyJWT, controller.updateAvatar)

router.get("/ping", controller.pong)

export default router