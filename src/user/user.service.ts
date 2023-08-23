import { faker } from '@faker-js/faker';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hash } from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
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

}
