import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Product 1',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 100,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'The description of the product',
    example: 'Product 1 description',
  })
  @IsString()
  description: string;
}
