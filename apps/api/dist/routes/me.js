import { verifyToken } from '@clerk/backend';
import { verifyClerkToken } from '../hooks/auth';
import { MeResponseSchema } from '../schemas/me';
export default async function meRoutes(app) {
    app.get('/me', {
        preHandler: [verifyClerkToken],
        schema: {
            response: {
                200: MeResponseSchema,
                401: { type: 'object', properties: { error: { type: 'string' } } },
            },
        },
    }, async (request, reply) => {
        const token = request.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return reply.code(401).send({ error: 'Unauthorized' });
        }
        try {
            const session = await verifyToken(token, {
                secretKey: process.env.CLERK_SECRET_KEY,
            });
            const email = session.email_addresses?.[0]?.email_address ?? '';
            const name = [session.first_name, session.last_name].filter(Boolean).join(' ') || null;
            const response = {
                id: session.sub,
                email,
                name,
            };
            return reply.code(200).send(MeResponseSchema.parse(response));
        }
        catch {
            return reply.code(401).send({ error: 'Unauthorized' });
        }
    });
}
