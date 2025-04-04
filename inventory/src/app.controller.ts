import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Inventory')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Route to get a product
  @ApiOperation({ summary: 'Consultar un producto' })
  @Get(':id')
  findProduct(@Param('id') id: string): Promise<string> {
    return this.appService.findProduct(+id);
  }
}
