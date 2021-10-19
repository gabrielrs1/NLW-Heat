import prismaClient from "../prisma"

class GetLast3MessagesService {
    async execute() {
        // SELECT * FROM messages LIMIT 3 ORDER BY created_at DESC
        const messages = await prismaClient.message.findMany({
            take: 3,
            orderBy: {
                created_at: "desc"
            },
            include: {
                user: true
            }
        });

        return messages;
    }
}

export { GetLast3MessagesService }