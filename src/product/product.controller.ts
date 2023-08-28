import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GetAllProductDto } from './dto/get-products.dto';
import { ProductDto } from './dto/product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAll(@Query() queryDto: GetAllProductDto) {
    return this.productService.getAll(queryDto);
  }
  @Get(':productId')
  getById(@Param('productId') productId: string) {
    return this.productService.getById(+productId);
  }
  @Get('by-category/:category')
  getByCategory(@Param('category') category: string) {
    return this.productService.getByСategory(category);
  }
  @Get('by-slug/:slug')
  getBySlug(@Param('slug') slug: string) {
    return this.productService.getBySlug(slug);
  }
  @Post()
  creaet(@Body() dto: ProductDto) {
    return this.productService.create(dto);
  }
  @Get('similar/:productId')
  getSimilar(@Param('productId') productId: string) {
    return this.productService.getSimilar(+productId);
  }
}
