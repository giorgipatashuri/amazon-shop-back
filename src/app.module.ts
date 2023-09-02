import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ReviewModule } from './review/review.module';
import { ProductModule } from './product/product.module';
import { PaginationModule } from './pagination/pagination.module';
import { WakeUpModule } from './wake-up/wake-up.module';


@Module({
  imports: [UserModule, AuthModule, CategoryModule, ReviewModule, ProductModule, PaginationModule, WakeUpModule,],
  controllers: [],
  providers: [],
})
export class AppModule {}
