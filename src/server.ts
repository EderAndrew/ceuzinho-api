import express from "express"
import cors from "cors"
import helmet from "helmet"
import { toNodeHandler } from "better-auth/node"
import { auth } from "./lib/auth"
import { PrismaClient } from "../generated/prisma"
import routes from "./routes"

const server = express()
const prisma = new PrismaClient()

server.use(cors())
server.use(helmet())
server.all("/api/auth/*splat", toNodeHandler(auth))
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use("/api", routes)

process.on('SIGINT', async () => {
    await prisma.$disconnect()
    console.log('Conexão Prisma fechada (SIGINT)');
    process.exit(0);
})

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    console.log('Conexão com Prisma fechada devido ao SIGTERM.');
    process.exit(0);
});


server.listen(process.env.PORT || 3000, () => {
    console.log(`Server online on port: ${process.env.PORT || 3000}`)
})