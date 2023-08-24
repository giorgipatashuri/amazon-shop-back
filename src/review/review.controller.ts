import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ReviewDto } from './dto/review.dto';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}


  @Get()
  getAll(){
    return this.reviewService.getAll()
  }

  @Post("leave/:productId")
  @Auth()
  create(@Param("productId") productId:string,@CurrentUser("id") userId:string,@Body() dto:ReviewDto ){
    return this.reviewService.create(+productId,+userId,dto)
  }
  @Delete(":productId")
  delete(@Param("productId") productId:string){
    return this.reviewService.delete(+productId)
  }
}
