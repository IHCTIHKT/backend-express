import { IsInt } from 'class-validator';

export class OrderDeleteDto {
  @IsInt()
  id: number;
}
