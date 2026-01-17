import express, { ErrorRequestHandler, Request, Response } from "express"
import cors from "cors"
import helmet from "helmet"
import { PrismaClient } from "@prisma/client"
import routes from "./routes"
import cookieParser from "cookie-parser"

const server = express()
const prisma = new PrismaClient()

server.use(cors(
    {
        credentials: true
    }
))
server.use(helmet())
server.use(cookieParser())
server.use(express.json())
server.use(express.static('public'));
server.use(express.urlencoded({ extended: true }))
server.use("/api", routes)

server.use((req: Request, res: Response) => {
    res.status(404).json({ status: 404, message: "Endpoint não encontrado." })
})

const errorHandler:ErrorRequestHandler = (err, req, res, next) => {
    console.log(err)
    res.status(400).json({error: "Ocorreu algum erro"})
}

server.use(errorHandler)

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