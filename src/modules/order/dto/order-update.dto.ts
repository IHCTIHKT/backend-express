import { IsNumber, IsString } from 'class-validator';

export class OrderUpdateDto {
  @IsString()
  product: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsString()
  status: string;
}
