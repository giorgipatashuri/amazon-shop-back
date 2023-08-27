import { Injectable } from '@nestjs/common';
import { PaginationDto } from './pagination.dto';

@Injectable()
export class PaginationService {
  getPagination(dto: PaginationDto, limit: number = 10) {
    const page = dto.page ? +dto.page : 1;
    const offset = dto.limit ? +dto.limit : limit;

    const skip = (page - 1) * limit;

    return { offset, skip };
  }
}
