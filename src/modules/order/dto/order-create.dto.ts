import { IsString, Length } from 'class-validator';

export class OrderCreateDto {
  @Length(3)
  @IsString()
  name: string;

  @IsString()
  order: string;
}
