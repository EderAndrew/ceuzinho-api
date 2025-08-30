import { PrismaClient } from "@prisma/client"
import { generateReadablePassword, getBackgroundColorBySex } from "../src/modules/users/utils/userUtils";
import { hashSync } from "bcrypt";
import { PASSWORD_CONFIG } from "../src/modules/users/utils/constants";
const prisma = new PrismaClient()

//const randomPassword = generateReadablePassword(PASSWORD_CONFIG.DEFAULT_LENGTH);
const hashedPassword = hashSync(process.env.SEED_PASSWORD as string, PASSWORD_CONFIG.SALT_ROUNDS);

async function main() {
    const user = await prisma.user.upsert({
        where: { email: "ederandrew0028@gmail.com" },
        update: {},
        create: {
            name: "Eder Andrew",
            email: "ederandrew0028@gmail.com",
            password: hashedPassword,
            phone: "(11) 98625-7092",
            role: "ADMIN",
            sex: "MASCULINO",
            bgColor: getBackgroundColorBySex("MASCULINO"),
        }
    })
    console.log(`User created: ${user}`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })