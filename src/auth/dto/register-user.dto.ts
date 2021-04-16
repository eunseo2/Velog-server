import { IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  email: string;
  @IsString()
  username: string;
  @IsString()
  userID: string;
  @IsString()
  Intro: string;
}
