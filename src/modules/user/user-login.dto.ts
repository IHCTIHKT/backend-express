import { IsString, Length } from 'class-validator';

export class UserLoginDto {
  @Length(3)
  @IsString()
  login: string;

  @Length(5)
  @IsString()
  password: string;
}
