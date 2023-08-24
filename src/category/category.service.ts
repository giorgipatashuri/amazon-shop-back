import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { categoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
    constructor(private readonly prisma:PrismaService){}

    async getByIdOrName(idOrName: string) {
        const category = await this.prisma.category.findUnique({
            where: {
                id: !isNaN(Number(idOrName)) ? parseInt(idOrName) : undefined,
                name: isNaN(Number(idOrName)) ? idOrName : undefined
            }
        });
    
        if (!category) {
            throw new BadRequestException("Category not found");
        }
    
        return category;
    }
    

    async getAll(){
        return this.prisma.category.findMany()
    }

    async create(dto:categoryDto){
        return await this.prisma.category.create({data:{name:dto.name}})
    }
    async update(id:number,dto:categoryDto){
        const categoryToUpdate = await this.prisma.category.findUnique({ where: { id } });
      
        if (!categoryToUpdate) {
          throw new NotFoundException("Category not found");
        }
        return await this.prisma.category.update({where:{id},data:{name:dto.name}})
    }
    async delete(id: number) {
        const categoryToDelete = await this.prisma.category.findUnique({ where: { id } });
      
        if (!categoryToDelete) {
          throw new NotFoundException("Category not found");
        }
      
        const deletedCategory = await this.prisma.category.delete({ where: { id } });
      
        if (!deletedCategory) {
          throw new InternalServerErrorException("Failed to delete category");
        }
      
        return {
          message: "Category successfully deleted",
        };
      }
      
    
}
