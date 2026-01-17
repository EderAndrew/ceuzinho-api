
import { getBackgroundColorBySex } from "../src/modules/users/utils/userUtils";
import { hashSync } from "bcrypt";
import { PASSWORD_CONFIG } from "../src/modules/users/utils/constants";
import { Role, Sex } from "./generated/prisma/client";
import { prisma } from "./lib/prisma";

const hashedPassword = hashSync(process.env.SEED_PASSWORD as string, PASSWORD_CONFIG.SALT_ROUNDS);

async function main() {
    const user = await prisma.user.upsert({
        where: { email: "ederandrew0028@gmail.com" },
        update: {},
        create: {
            name: process.env.SEED_NAME as string,
            email: process.env.SEED_EMAIL as string,
            password: hashedPassword,
            phone: process.env.SEED_PHONE as string,
            role: process.env.SEED_ROLE as Role,
            sex: process.env.SEED_SEX as Sex,
            bgColor: getBackgroundColorBySex(process.env.SEED_SEX as Sex),
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