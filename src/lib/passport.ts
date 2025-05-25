import passport from "passport"
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt"
import { PrismaClient } from "../../generated/prisma"
import { NextFunction, Request, Response } from "express"
import { findUserByIdService } from "../modules/users/service"


const notAuthorizedJson = { status: 401, message: "Não Autorizado." }
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET as string
}

const prisma = new PrismaClient()

passport.use(new JWTStrategy(options, async(payload, done) => {
    try{
        const user = await findUserByIdService(payload.payload.id)

        if(!user){
            return done(notAuthorizedJson, false)
        }

        return done(null, user)
    }catch(error){
        if(error instanceof Error){
            console.log(error.message)
        }
    }
}))

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("jwt", { session: false }, (error: string, user: any) => {
        req.user = user
        return user ? next() : next(notAuthorizedJson)
    })(req, res, next)
}

export default passport