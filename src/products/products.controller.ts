import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDTO } from './DTOs/products.DTO';
import { ProductQueryDTO } from './DTOs/productQuery.dto';
import { custompPipe } from './pipes/products.pipe';
import { Transform } from 'stream';

@Controller('products')
export class ProductsController {
  constructor(private productsServices: ProductsService) {}

  @Get()
  getProduct(
    @Query(new custompPipe) query: ProductQueryDTO,
    @Headers() headers,
  ) {
    const { id, category, price, lang} = query;
    if(category && price){
      return this.productsServices.getCategoryXprice(query)
    }
    if (price) {
      return this.productsServices.getfilteredPrice(query);
    }
    if(category){
      return this.productsServices.getExactlyCategory(query)
    }
    if (id) {
      const idx = parseInt(id);
      return this.productsServices.getProductsById(idx);
    }
    return this.productsServices.getAllProducts(headers,lang);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.productsServices.getProductsById(id);
  }

  @Post()
  createProduct(@Body() body: ProductDTO) {
    return this.productsServices.createProduct(body);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id) {
    return this.productsServices.delete(id);
  }

  @Put(':id')
  update(@Body() body: ProductDTO, @Param('id', ParseIntPipe) id: number) {
    return this.productsServices.update(id, body);
  }
}
