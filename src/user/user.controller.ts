import { Body, Controller, Get, Param, Patch, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Auth()
  @Get("profile")
  getProfile(@CurrentUser("id") id:number){
    return this.userService.getById(id)
  }

  @Auth()
  @Put("profile")
  updateProfile(@CurrentUser("id") id:number, @Body() dto:UpdateUserDto){
    return this.userService.updateProfile(id,dto)
  }

}
