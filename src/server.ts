import express, { ErrorRequestHandler, Request, Response } from "express"
import cors from "cors"
import helmet from "helmet"
import routes from "./routes"
import cookieParser from "cookie-parser"

const server = express()

server.use(cors(
    {
        origin: "*",
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

server.listen(process.env.PORT || 3000, () => {
    console.log(`Server online on port: ${process.env.PORT || 3000}`)
})