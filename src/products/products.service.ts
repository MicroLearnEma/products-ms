import { HttpStatus, Inject, Injectable, Logger, LoggerService, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { env } from 'src/config';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);

  onModuleInit() {
    this.$connect();
    if(env.environment === 'debug') this.logger.debug(`Connection created to database`);
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    
    const totalItems = await this.totalItems();
    const lastPage = Math.ceil(totalItems / limit);
    
    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          deletedAt: null
        }
      }),
      meta: {
        total: totalItems,
        page: page,
        last: lastPage
      }
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { 
        id, 
        deletedAt: null
      }
    })
    
    if (!product){
      throw new RpcException({ message: `Product with id #${id} not found`, status: HttpStatus.NOT_FOUND })
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    const {id: __, ...data} = updateProductDto;

    return this.product.update({
      where : {
        id,
        deletedAt : null
      },
      data
    })
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.product.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });
  }

  private async  totalItems(){
    return await this.product.count({
      where: {
        deletedAt: null
      }
    });
  }
}
