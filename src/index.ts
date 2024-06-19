import { Hono } from 'hono'
import { cityRouter } from './routes/cityRoutes';
import { stationRouter } from './routes/stationRoutes';
import { trainRouter } from './routes/trainRoutes';

export const app = new Hono<{
  Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
  }
}>();

app.route('/api/v1/city', cityRouter)
app.route('/api/v1/station', stationRouter)
app.route('/api/v1/train', trainRouter)


export default app