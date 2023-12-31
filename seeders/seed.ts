import { faker } from "@faker-js/faker";
import { PrismaClient, Product } from "@prisma/client";

const prisma = new PrismaClient()


const createProducts=async(amount:number)=>{
    const products:Product[] = []
    

    for(let i = 0; i<amount; i++){
        let productName = faker.commerce.productName()
        let categoryName = faker.commerce.department()
        // while (await prisma.product.findUnique({ where: { name: productName } })) {
        //     productName = faker.commerce.productName();
        //   }
        const productSlug = faker.helpers.slugify(productName);
    
        const product = await prisma.product.create({
            data:{
                name:productName,
                slug:productSlug,   
                description:faker.commerce.productDescription(),
                price:+faker.commerce.price({min:10,max:900}),
                images:Array.from({length:faker.number.int({min:2,max:6})}).map(()=>faker.image.url()),
                category:{
                    create:{
                        name:categoryName,
                    }
                },
                reviews:{
                    create:[
                        {
                            rating:faker.number.int({min:1,max:5}),
                            text:faker.lorem.paragraph(),
                            user:{
                                connect:{
                                    id:1
                                }
                            }
                        },
                        {
                            rating:faker.number.int({min:1,max:5}),
                            text:faker.lorem.paragraph(),
                            user:{
                                connect:{
                                    id:1
                                }
                            }
                        }   
                    ]
                }
                
            }
        })
        products.push(product)
    }


    console.log(`Created ${products.length} products `)
}



async function main(){
    console.log("start seeding")
    await createProducts(10)
}
main().catch(e=>console.log(e)).finally(async()=>prisma.$disconnect())
