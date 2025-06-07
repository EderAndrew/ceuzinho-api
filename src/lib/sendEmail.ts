import { transporter } from "./emailTransporter"

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