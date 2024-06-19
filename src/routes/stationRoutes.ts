import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Hono } from 'hono';

export const stationRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
  }

}>()
