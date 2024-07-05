import { IsInt, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'

/**
 * Limit a number to a range
 * @param min_value
 * @param max_value (optional)
 * @returns {function({value: number}): number}
 */
function limitToRange(min_value: number, max_value?: number) {
  if (max_value === undefined) {
    return ({ value }: { value: number }) => Math.max(Number(value), min_value)
  } else {
    return ({ value }: { value: number }) =>
      Math.min(Math.max(Number(value), min_value), max_value)
  }
}

export class PaginationDto {
  @Transform(limitToRange(0))
  @IsOptional()
  @IsInt()
  offset: number = 0

  @Transform(limitToRange(1, 100))
  @IsOptional()
  @IsInt()
  limit: number = 10
}
