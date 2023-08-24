import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewService {
    constructor(private readonly prisma:PrismaService){}


    async getAll(){
        return await this.prisma.review.findMany({
            include:{
                user:true,
                product:true,
            }
        })
    }


    async create(productId:number,userId: number,dto:ReviewDto){
        const product = await this.prisma.product.findUnique({where:{
            id:productId
        }})
        if(!product) throw new NotFoundException("Product not found")
        return await this.prisma.review.create({
            data:{
                rating:dto.rating,
                text:dto.text,
                user:{
                    connect:{
                        id:userId
                    }
                },
                product:{
                    connect:{
                        id:productId
                    }
                }
            },
            include:{
                user:true,
                product:true,
            }
        })
    }
    async delete(id: number) {
        const reviewToDelete = await this.prisma.review.findUnique({ where: { id } });
      
        if (!reviewToDelete) {
          throw new NotFoundException("Review not found");
        }
      
        const deletedReview = await this.prisma.review.delete({ where: { id } });
      
        if (!deletedReview) {
          throw new InternalServerErrorException("Failed to delete review");
        }
      
        return {
          message: "Review successfully deleted",
        };
      }
}
