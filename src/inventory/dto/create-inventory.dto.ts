import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator'

export class CreateInventoryDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsDate()
  @IsNotEmpty()
  manufactured_at: Date

  @IsNumber()
  @IsNotEmpty()
  quantity: number
}
