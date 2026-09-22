import { IsInt, IsNumber, IsString } from 'class-validator';

export class OrderUpdateDto {
  @IsString()
  product: string;

  @IsInt()
  quantity: number;

  @IsNumber()
  price: number;

  @IsString()
  status: string;
}
