import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Hono } from 'hono';

export const trainRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
  }

}>()


trainRouter.post('/',async (c)=>{

    const body = await c.req.json();

    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    

    try{

        const train = await prisma.train.create({
            data:{

               name:body.name,
               number:body.number,
               type:body.type
            }
        })
    
        return c.json({
            data:train,
            message:"successfully created train"
        })

    }catch(err){
        console.log(err);
        
        return c.json({
            data:null,
            message:"failed to create train"
        })

    }

   
})


trainRouter.put('/',async (c)=>{

    const body = await c.req.json();

    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const train = await prisma.train.update({
        where:{
            id:body.id
        },
        data:{
            
            name:body.name,
            number:body.number,
            type:body.type
        }
    })

    return c.json({
        data:train,
        message:"successfully updated station"    
    })
})



trainRouter.get('/:id',async (c)=>{
    const id =  c.req.param("id")

    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try{
        const train = await prisma.train.findFirst({
            where:{
                id:parseInt(id)
            },
            
        })
    
        return c.json({
            data:train,
            message:"successfully fetched train"    

        })

    }catch(err){

        return c.json({
            err
        })

    }
   
})


// Todo:pagination
trainRouter.get('/all/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    
    try {
        const filter = c.req.queries();

        let trains;
        if (filter && filter.name && filter.name[0]) {
            const nameStarts = filter.name[0];
            trains = await prisma.train.findMany({
                where: {
                    name: {
                        startsWith: nameStarts
                    }
                }
            });
        } else {
            trains = await prisma.train.findMany();
        }
        
        return c.json({
            data: trains,
            message: "successfully fetched all trains"
        });
    } catch (error) {
        console.log(error);
        return c.json({
            data: null,
            message: "failed to fetch trains"
        });
    }
});