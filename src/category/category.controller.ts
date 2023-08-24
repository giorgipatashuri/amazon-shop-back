import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { categoryDto } from './dto/category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}


  @Get()
  getAll(){
    return this.categoryService.getAll()
  }
  @Get(":idOrName")
  getByName(@Param("idOrName") idOrName:string){
    return this.categoryService.getByIdOrName(idOrName)
  }
  @Post()
  create(@Body() dto:categoryDto){
    return this.categoryService.create(dto)
  }
  @Delete(":id")
  delete(@Param("id") categoryId:string){
    return this.categoryService.delete(+categoryId)
  }
  @Put(":id")
  update(@Param("id") categoryId:string,@Body() dto:categoryDto){
    return this.categoryService.update(+categoryId,dto)
  }   
}
