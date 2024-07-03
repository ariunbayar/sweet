import { IsNotEmpty, IsString } from 'class-validator'

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  address: string

  @IsString()
  @IsNotEmpty()
  manager_name: string
}
