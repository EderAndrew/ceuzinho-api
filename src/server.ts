import express from "express"
import cors from "cors"
import helmet from "helmet"
import { toNodeHandler } from "better-auth/node"
import { auth } from "./lib/auth"

const server = express()

server.use(cors())
server.use(helmet())
server.all("/api/auth/*splat", toNodeHandler(auth))
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

server.listen(process.env.PORT || 3000, () => {
    console.log(`Server online on port: ${process.env.PORT || 3000}`)
})