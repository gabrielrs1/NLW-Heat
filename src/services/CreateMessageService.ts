import prismaClient from "../prisma"
import { io } from "../app";

class CreateMessageService {
    async execute(text: string, user_id: string) {
        const message = await prismaClient.message.create({
            data: {
                text,
                user_id
            },
            // inclui a tabela user no retorno também
            include: {
                user: true
            }
        });

        const infoWS = {
            text: message.text,
            user_id: message.id,
            created_at: message.created_at,
            user: {
                name: message.user.name,
                picture: message.user.picture
            }
        }

        io.emit("new_message", infoWS);

        return message;
    }
}

export { CreateMessageService }