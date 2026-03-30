import Fastify from 'fastify'
import cors from '@fastify/cors'
import meRoutes from './routes/me'
import profissionaisRoutes from './routes/profissionais/index'
import especialidadesRoutes from './routes/especialidades/index'

export async function buildApp() {
  const app = Fastify({
    logger: true,
  })

  // CORS
  await app.register(cors, {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  // Rotas
  await app.register(meRoutes)
  await app.register(profissionaisRoutes)
  await app.register(especialidadesRoutes)

  return app
}
