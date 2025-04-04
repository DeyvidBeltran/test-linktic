import { HttpException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async create(product: CreateProductDto) {
    //verificar que el producto no exista con el mismo nombre
    const productExists = await this.productRepository.findOneBy({
      name: product.name,
    });
    if (productExists) {
      throw new HttpException('Product already exists', 400);
    }

    const newProduct = await this.productRepository.save(product);
    return {
      data: {
        type: 'products',
        id: newProduct.id,
        attributes: {
          name: product.name,
          price: product.price,
        },
      },
    };
  }

  async findAll() {
    const products = await this.productRepository.find();
    return {
      data: products.map((product) => ({
        type: 'products',
        id: product.id,
        attributes: {
          name: product.name,
          price: product.price,
        },
      })),
    };
  }

  async findOne(id: number) {
    const producto = await this.productRepository.findOneBy({ id });
    if (!producto) {
      throw new HttpException('Product not found', 404);
    }
    return {
      data: {
        type: 'products',
        id: producto.id,
        attributes: {
          name: producto.name,
          price: producto.price,
        },
      },
    };
  }

  async update(id: number, product: UpdateProductDto) {
    const updatedProduct = await this.productRepository.update(id, product);
    if (updatedProduct.affected <= 0) {
      throw new HttpException('Product not found', 404);
    }
    return {
      data: {
        type: 'products',
        id: id,
        attributes: {
          name: product.name,
          price: product.price,
        },
      },
    };
  }

  async remove(id: number) {
    const response = await this.productRepository.delete(id);
    if (response.affected <= 0) {
      throw new HttpException('Product not found', 404);
    }

    return { data: 'Delete product successfully' };
  }
}
