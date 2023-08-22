import { IsString,IsOptional } from "class-validator"

export class UpdateUserDto{
    @IsString()
    email:string
    @IsString()
    @IsOptional()
    password:string


    @IsString()
    @IsOptional()
    name:string
    

    @IsString()
    @IsOptional()
    avatarPath:string
}