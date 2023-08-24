import { IsString, Max, Min } from "class-validator"

export class ReviewDto{
    @Min(1)
    @Max(5)
    rating:number
    @IsString()
    text:string
}