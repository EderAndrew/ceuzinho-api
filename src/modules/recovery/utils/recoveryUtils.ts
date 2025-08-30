import nodemailer from "nodemailer"

/* export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PWD,
    }
}) */

export const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "3fb1ae64a4405f",
        pass: "6d02191e94c626"
    }
})

export const sendEmail = async(email: string, msg: string) => {
    const info = await transporter.sendMail({
        from: `"nao-responda" <${process.env.NODEMAILER_EMAIL}>`,
        to: email,
        subject: "Bem vindo a Ceuzinho",
        text: msg,
        html: msg
    })

    return info
}