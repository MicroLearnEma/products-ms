import { Controller, Get, Post, Patch, Param, Delete, assignMetadata, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern('create')
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // @Get()
  @MessagePattern('find_all')
  findAll(@Payload() paginationDto: PaginationDto ) {
    return this.productsService.findAll(paginationDto);
  }

  // @Get(':id')
  @MessagePattern('find_one')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(+id);
  }

  // @Patch(':id')
  @MessagePattern('update_product')
  update(@Payload() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  // @Delete(':id')
  @MessagePattern('delete_product')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(+id);
  }
}
