export class PaginatedResultDto<T> {
  result: T[]
  pagination: {
    offset: number
    limit: number
    total: number
  }
}
