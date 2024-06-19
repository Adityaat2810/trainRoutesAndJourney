import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Hono } from 'hono';

export const cityRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
  }

}>()


cityRouter.post('/',async (c)=>{

    const body = await c.req.json();

    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    console.log(body);
    

    try{

        const city = await prisma.city.create({
            data:{
                name:body.name,
                state:body.state,
                country:body.country
            }
        })
    
        return c.json({
            data:city,
            message:"successfully created city"
        })

    }catch(err){
        console.log(err);
        
        return c.json({
            data:null,
            message:"failed to create city"
        })

    }

   
})


cityRouter.put('/',async (c)=>{

    const body = await c.req.json();

    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const city = await prisma.city.update({
        where:{
            id:body.id
        },
        data:{
            name:body.name,
            state:body.state,
            country:body.countary
        }
    })

    return c.json({
        data:city,
        message:"successfully updated city"    
    })
})



cityRouter.get('/:id',async (c)=>{
    const id =  c.req.param("id")

    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try{
        const city = await prisma.city.findFirst({
            where:{
                id:parseInt(id)
            },
            
        })
    
        return c.json({
            data:city,
            message:"successfully fetched city"    

        })

    }catch(err){

        return c.json({
            err
        })

    }
   
})


// Todo:pagination
cityRouter.get('/all/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    
    try {
        const filter = c.req.queries();

        let cities;
        if (filter && filter.name && filter.name[0]) {
            const nameStarts = filter.name[0];
            cities = await prisma.city.findMany({
                where: {
                    name: {
                        startsWith: nameStarts
                    }
                }
            });
        } else {
            cities = await prisma.station.findMany();
        }
        
        return c.json({
            data: cities,
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