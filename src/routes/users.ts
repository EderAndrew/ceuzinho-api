import { Router } from "express"
import * as controller from "../modules/users/controller"
import { verifyJWT } from "../middlewares/jwt"
import { formMiddleware } from "../middlewares/formMiddlware"

const router = Router()

router.post("/signin", controller.signIn)
router.post("/signup", verifyJWT, controller.signUp)
router.get("/me", verifyJWT, controller.me)
router.get("/all", verifyJWT, controller.allUsers)
router.get("/teachers", verifyJWT, controller.allTeachers)
router.put("/edituser/:id", verifyJWT, controller.editUser)
router.put("/disable/:id", verifyJWT, controller.disableUser)
router.put("/changePassword", verifyJWT, controller.changePassword)
router.put("/uploadimage/:id", verifyJWT, formMiddleware, controller.uploadAvatar)

router.get("/ping", controller.pong)

export default router