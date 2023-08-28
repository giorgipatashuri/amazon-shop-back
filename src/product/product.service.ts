import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma.service';
import { GetAllProductDto, ProductSortEnum } from './dto/get-products.dto';
import { ProductDto } from './dto/product.dto';

const productSelectFields: Prisma.ProductSelect = {
  name: true,
  slug: true,
  description: true,
  price: true,
  images: true,
  category: true,
  reviews: true,
};

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async getAll(dto: GetAllProductDto = {}) {
    const { searchTerm, sort } = dto;

    const prismaSort: Prisma.ProductOrderByWithRelationInput[] = [];

    switch (sort) {
      case ProductSortEnum.HIGH_PRICE:
        prismaSort.push({ price: 'desc' });
      case ProductSortEnum.LOW_PRICE:
        prismaSort.push({ price: 'asc' });
      case ProductSortEnum.OLDEST:
        prismaSort.push({ createdAt: 'asc' });
      default:
        prismaSort.push({ createdAt: 'desc' });
    }

    const prismaSearchTerm: Prisma.ProductWhereInput = searchTerm
      ? {
          OR: [
            {
              category: {
                name: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
            },
            {
              name: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {};

    const { offset, skip } = this.paginationService.getPagination(dto);

    const products = await this.prisma.product.findMany({
      where: prismaSearchTerm,
      orderBy: prismaSort,
      skip: skip,

      take: offset,
      select: productSelectFields,
    });

    return {
      products,
      length: await this.prisma.product.count({
        take: offset,
        where: prismaSearchTerm,
      }),
    };
  }

  async getById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: productSelectFields,
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }
  async getBySlug(slug: string) {
    const product = await this.prisma.product.findMany({
      where: { slug },
      select: productSelectFields,
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }
  async getByСategory(categoryName: string) {
    const product = await this.prisma.product.findMany({
      where: { category: { name: categoryName } },
      select: productSelectFields,
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }
  async getSimilar(id: number) {
    const currentProduct = await this.getById(id);

    const similarProducts = await this.prisma.product.findMany({
      where: {
        category: {
          name: currentProduct.category.name,
        },
        NOT: {
          id: currentProduct.id,
        },
      },
    });
    return similarProducts;
  }
  async create(dto: ProductDto) {
    return await this.prisma.product.create({
      data: { ...dto },
    });
  }
  async update(dto: ProductDto) {}
}
