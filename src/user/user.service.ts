import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { faker } from '@faker-js/faker';
import { hash } from 'argon2';
import { Prisma, User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';


const returnFields={
    id:true,
    createdAt:true,
    updatedAt:true,
    email:true,
    password:false,
    name:true,
    avatarPath:true,
}


@Injectable()
export class UserService {
    constructor(private readonly prisma:PrismaService){}

    async getAll(){
        return await this.prisma.user.findMany()
    }
    
    async getByEmail(email:string){
        return await this.prisma.user.findUnique({
            where:{
                email
            }
        })
    }
    async getById(id:number,selectFields:Prisma.UserSelect={}){
        const user = await this.prisma.user.findUnique({
            where:{
                id
            },
            select:{
                ...returnFields,
                favorites:true
                
            }
        })
        return user
    }

    async updateProfile(id:number,dto:UpdateUserDto){
        const isSameUser=await this.getByEmail(dto.email)

        if(isSameUser.id !== id) throw new BadRequestException("Email already in use")


        const user = await this.getById(id)


        return this.prisma.user.update({
            where:{
                id
            },
            data:{
                email:dto.email,
                name:dto.name,
                avatarPath:dto.avatarPath,
                password:dto.password ? await hash(dto.password) : user.password
            }
        })
    }
    async create(dto:CreateUserDto){
        return await this.prisma.user.create({data:{
            email:dto.email,
            name:faker.person.fullName(),
            password:await hash(dto.password),
            avatarPath:faker.image.avatar(),
        }})
    }
    async toggleFavorite(id:number,productId:number){
        const user = await this.getById(id)
        if(!user) throw new NotFoundException("User not found")

        const isExists = user.favorites.some(product => product.id = productId)


        this.prisma.user.update({
            where:{id},
            data:{
                favorites:{
                    [isExists ? "disconnect" : "connect"] : {
                        id:productId
                    }
                }
            }
        })
        return "Success"
    }

}
