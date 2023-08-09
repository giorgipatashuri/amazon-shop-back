import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  getAll(){
    return this.userService.getAll()
  }
  getByEmail(email:string){
    return this.userService.getByEmail(email)
  }
  create(dto:CreateUserDto){
    return this.userService.create(dto)
  }
}
