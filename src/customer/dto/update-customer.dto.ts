import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string
}
