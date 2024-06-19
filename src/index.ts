import { Hono } from 'hono'
import { cityRouter } from './routes/cityRoutes';
import { stationRouter } from './routes/stationRoutes';

export const app = new Hono<{
  Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
  }
}>();

app.route('/api/v1/city', cityRouter)
app.route('/api/v1/station', stationRouter)

export default app