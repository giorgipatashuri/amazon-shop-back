import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { faker } from '@faker-js/faker';
import { hash } from 'argon2';

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
    async getById(id:number){
        return await this.prisma.user.findUnique({
            where:{
                id
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
