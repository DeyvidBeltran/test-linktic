import { HttpException, Injectable } from '@nestjs/common';
import { Inventory } from './entities/inventory.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {}
  async findProduct(id: number, retries = 3, delay = 100): Promise<string> {
    try {
      // Intentar la solicitud GET al servicio de productos
      const response = await axios.get(
        `http://nestjs-products:3000/products/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'apikey123',
          },
        },
      );

      // Acceder a los datos de la respuesta
      const product = response.data;

      // validar que el producto exista
      const productExists = await this.inventoryRepository.findOneBy({
        producto_id: id,
      });

      // Agregar la cantidad del inventario al producto en attributes
      if (!productExists) {
        const inventoryCreated = await this.createInventory(id);
        console.log('Inventario creado: ', inventoryCreated);
      } else {
        product.data.attributes.quantity = productExists.quantity;
      }

      return product;
    } catch (error) {
      // Si el error es de tipo ECONNREFUSED (conexión rechazada), intenta nuevamente
      if (error.code === 'ECONNREFUSED' && retries > 0) {
        console.log(
          `Error en la solicitud: ${error.message}. Reintentando... (${retries} intentos restantes)`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay)); // Esperar un tiempo antes de reintentar
        return this.findProduct(id, retries - 1, delay); // Intentar nuevamente
      }

      // Si no se pudo recuperar, lanzar un error con un mensaje adecuado
      console.log('Error en la solicitud:', error);
      throw new HttpException('Error al obtener productos', 500);
    }
  }

  async createInventory(id: number) {
    const newInventory = await this.inventoryRepository.save({
      producto_id: id,
      quantity: 50,
    });
    return newInventory;
  }
}
