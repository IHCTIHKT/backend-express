import { IsString, Length } from 'class-validator';

export class UserRegisterDto {
  @Length(3)
  @IsString()
  name: string;

  @Length(3)
  @IsString()
  login: string;

  @Length(5)
  @IsString()
  password: string;
}
