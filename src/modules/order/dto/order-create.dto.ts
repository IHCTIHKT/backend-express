import { IsInt, IsNumber, IsString } from 'class-validator';

export class OrderCreateDto {
  @IsInt()
  userId: number;

  @IsString()
  product: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsString()
  status: string;
}
