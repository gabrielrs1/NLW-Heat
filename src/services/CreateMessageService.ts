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

        const info = {
            text: message.text,
            user_id: message.id,
            created_at: message.created_at,
            user: {
                name: message.user.name,
                avatar_url: message.user.avatar_url
            }
        }

        io.emit("new_message", info);

        return message;
    }
}

export { CreateMessageService }