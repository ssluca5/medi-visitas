import { verifyToken } from '@clerk/backend';
export async function verifyClerkToken(request, reply) {
    try {
        const token = request.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            reply.code(401).send({ error: 'Unauthorized' });
            return;
        }
        const session = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
        });
        if (!session) {
            reply.code(401).send({ error: 'Unauthorized' });
            return;
        }
        request.userId = session.sub;
        request.orgId = session.org_id;
    }
    catch {
        reply.code(401).send({ error: 'Unauthorized' });
    }
}
