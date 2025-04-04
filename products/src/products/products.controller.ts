import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiKeyGuard } from 'src/api-key/api-key.guard';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
@ApiHeader({ name: 'x-api-key', description: 'Clave de API' })
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Route to create a new product
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(ApiKeyGuard)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // Route to get all products
  @Get()
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos obtenida correctamente',
  })
  findAll() {
    return this.productsService.findAll();
  }

  // Route to get a product by id
  @Get(':id')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: 'Obtener un producto por su ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  // Route to update a product
  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID del producto a actualizar',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  // Route to delete a product
  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID del producto a eliminar',
  })
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
