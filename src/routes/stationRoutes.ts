import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Hono } from 'hono';

export const stationRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
  }

}>()


stationRouter.post('/',async (c)=>{

    const body = await c.req.json();

    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    

    try{

        const station = await prisma.station.create({
            data:{
               name:body.name,
               code:body.code,
               city_id:body.city_id
            }
        })
    
        return c.json({
            data:station,
            message:"successfully created station"
        })

    }catch(err){
        console.log(err);
        
        return c.json({
            data:null,
            message:"failed to create station"
        })

    }

   
})


stationRouter.put('/',async (c)=>{

    const body = await c.req.json();

    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const station = await prisma.station.update({
        where:{
            id:body.id
        },
        data:{
            name:body.name,
            code:body.code,
            city_id:body.city_id
        }
    })

    return c.json({
        data:station,
        message:"successfully updated station"    
    })
})



stationRouter.get('/:id',async (c)=>{
    const id =  c.req.param("id")

    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try{
        const station = await prisma.station.findFirst({
            where:{
                id:parseInt(id)
            },
            
        })
    
        return c.json({
            data:station,
            message:"successfully fetched station"    

        })

    }catch(err){

        return c.json({
            err
        })

    }
   
})


// Todo:pagination
stationRouter.get('/all/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    
    try {
        const filter = c.req.queries();

        let stations;
        if (filter && filter.name && filter.name[0]) {
            const nameStarts = filter.name[0];
            stations = await prisma.station.findMany({
                where: {
                    name: {
                        startsWith: nameStarts
                    }
                }
            });
        } else {
            stations = await prisma.station.findMany();
        }
        
        return c.json({
            data: stations,
            message: "successfully fetched all stations"
        });
    } catch (error) {
        console.log(error);
        return c.json({
            data: null,
            message: "failed to fetch stations"
        });
    }
});