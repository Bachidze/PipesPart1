import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IProducts } from './DTOs/products.interface';
import { ProductDTO } from './DTOs/products.DTO';

@Injectable()
export class ProductsService {
  private products: IProducts[] = [
    {
      id: 1,
      name: 'Beaded T-Shirt',
      description: 'Handmade cotton t-shirt with colorful beadwork.',
      price: 25.99,
      inStock: true,
      category: 'Apparel',
    },
    {
      id: 2,
      name: 'Wireless Earbuds',
      description: 'Bluetooth 5.0 earbuds with noise cancellation.',
      price: 49.99,
      inStock: true,
      category: 'Electronics',
    },
    {
      id: 3,
      name: 'Ceramic Coffee Mug',
      description: 'Matte black ceramic mug, 350ml capacity.',
      price: 12.5,
      inStock: false,
      category: 'Home & Kitchen',
    },
  ];
  private productsGeo: IProducts[] = [
    {
      id: 1,
      name: 'მაისური',
      description: 'ხელნაკეთი აპარელიტ მოხატული მაისური',
      price: 25.99,
      inStock: true,
      category: 'Apparel',
    },
    {
      id: 2,
      name: 'უსადენო ყურსასმენები',
      description: 'ბლუტთუზი 5.0 სიხშირის',
      price: 49.99,
      inStock: true,
      category: 'Electronics',
    },
    {
      id: 3,
      name: 'ყავა',
      description: '350მლ ყავა',
      price: 12.5,
      inStock: false,
      category: 'Home & Kitchen',
    },
  ];

  getAllProducts(header,lang) {
    if (!header.apikey || header.apikey !== '12345')
      throw new HttpException('unauth', HttpStatus.UNAUTHORIZED);
    if(lang == "ka"){
      return this.productsGeo
    }
    return this.products;
  }

  getfilteredPrice(query) {
    if (query?.price) {
      const targetPrice = parseFloat(query.price);
      return this.products.filter((el) => el.price > targetPrice);
    }
    return this.products;
  }

  getExactlyCategory(query){
    if(query?.category){
      return this.products.filter((el) => el.category === query.category)
    }
    return this.products
  }

  getCategoryXprice(query) {

    if (query.category && query.price) {
      const targetPrice = parseFloat(query.price);
      return this.products.filter(
        (el) => el.category === query.category && el.price === targetPrice,
      );
    }
    return this.products;
  }
  

  getProductsById(id: number,) {
    const product = this.products.find((el) => el.id === id);  
    if (!product)
      throw new HttpException('Product ID is invalid', HttpStatus.NOT_FOUND);
    return product;
  }

  createProduct(body: ProductDTO) {
    const lastId = this.products[this.products.length - 1]?.id || 0;
    if (!body.name || !body.price)
      throw new HttpException(
        'name and price is required',
        HttpStatus.BAD_REQUEST,
      );
    const newProduct = {
      id: lastId + 1,
      name: body.name,
      description: body.description,
      price: body.price,
      inStock: body.inStock,
      category: body.category,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  delete(id: number) {
    const index = this.products.findIndex((el) => el.id === id);
    if (index === -1)
      throw new HttpException('id is invalid', HttpStatus.NOT_FOUND);
    const deltedProduct = this.products.splice(index, 1);
    return deltedProduct;
  }

  update(id: number, body: ProductDTO) {
    const index = this.products.findIndex((el) => el.id === id);
    if (!index) throw new HttpException('id is invalid', HttpStatus.NOT_FOUND);
    this.products[index] = {
      ...this.products[index],
      ...body,
    };
    return this.products[index];
  }
}
