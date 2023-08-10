import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { authDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
    constructor(private readonly userService:UserService,private readonly jwt:JwtService){}

    async register(dto:authDto){
        const oldUser = await this.userService.getByEmail(dto.email)

        if(oldUser) throw new BadRequestException("User already exists")

        const user = await this.userService.create(dto)
        
        const tokens = await this.issueTokens(user.id)

        return {
            user:this.returnUserFields(user),
            ...tokens
        }
    }
    async login(dto:authDto){
        const user = await this.validateUser(dto)

        const tokens = await this.issueTokens(user.id)

        return {
            user:this.returnUserFields(user),
            ...tokens
        }
    }
    async getNewTokens(refreshToken:string){
        const result = await this.jwt.verifyAsync(refreshToken)
        if(!result) throw new UnauthorizedException("Invalid token")

        const user = await this.userService.getById(result.id)

        const tokens = await this.issueTokens(user.id)

        return {
            user:this.returnUserFields(user),
            ...tokens
        }
    }
    

    private async validateUser(dto:authDto){
        const user = await this.userService.getByEmail(dto.email)


        if(!user) throw new NotFoundException("User not found")


        const isValid = await verify(user.password,dto.password)

        if(!isValid) throw new UnauthorizedException("Invalid password or email")


        return user
    }

    private async issueTokens(userId:number){
        const data ={id:userId}

        const accessToken = this.jwt.sign(data,{
            expiresIn:"1h"
        })
        const refreshToken = this.jwt.sign(data,{
            expiresIn:"7d"
        })
        return {accessToken,refreshToken}
    }
    private returnUserFields(user:User){
        return {
            id:user.id,
            email:user.email
        }
    }
}
