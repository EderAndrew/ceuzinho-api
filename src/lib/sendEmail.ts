import { transporter } from "./emailTransporter"

export const sendEmail = async(email: string, pwd: string) => {
    const info = await transporter.sendMail({
        from: `"nao-responda" <${process.env.NODEMAILER_EMAIL}>`,
        to: email,
        subject: "Bem vindo a Ceuzinho",
        text: "Obrigado por fazer parte da equipe da Ceuzinho. Deus te abençoe imensamente. Segue a senha de acesso ao aplicativo: "+pwd,
        html: "Obrigado por fazer parte da equipe da Ceuzinho. Deus te abençoe imensamente. Segue a senha de acesso ao aplicativo: "+pwd
    })

    return info
}