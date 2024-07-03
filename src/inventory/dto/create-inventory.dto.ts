import { IsDateString, IsNotEmpty, IsString, IsNumber } from 'class-validator'

export class CreateInventoryDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsDateString()
  @IsNotEmpty()
  manufactured_at: Date

  @IsNumber()
  @IsNotEmpty()
  quantity: number
}
