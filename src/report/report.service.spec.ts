import { Test, TestingModule } from '@nestjs/testing'
import { Repository, SelectQueryBuilder } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'

import { ReportService } from './report.service'
import { OrderMonthly } from './entities/order_monthly.entity'
import { OrderStatus } from '../common/enums/order-status.enum'

const manyOrderMonthly = [
  {
    store_id: 27,
    status: 'pending',
    quantity: 10,
    year_month: '2023-10',
  },
  {
    store_id: 27,
    status: 'shipped',
    quantity: 5,
    year_month: '2023-10',
  },
  {
    store_id: 13,
    status: 'pending',
    quantity: 2,
    year_month: '2023-10',
  },
]

describe('ReportService', () => {
  let service: ReportService
  let repository: Repository<OrderMonthly>
  let builder: SelectQueryBuilder<OrderMonthly>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: getRepositoryToken(OrderMonthly),
          useValue: {
            createQueryBuilder: jest.fn(() => builder),
          },
        },
      ],
    }).compile()

    service = module.get<ReportService>(ReportService)
    repository = module.get<Repository<OrderMonthly>>(
      getRepositoryToken(OrderMonthly),
    )
    builder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
    } as unknown as SelectQueryBuilder<OrderMonthly>
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAllOrderMonthly()', () => {
    it('should return order monthly data', async () => {
      const filterOrderMonthlyDto = {
        year_month_min: '2023-10',
        year_month_max: '2023-10',
        store_ids: [27, 13],
        status_list: [OrderStatus.PENDING, OrderStatus.SHIPPED],
      }
      const expected = manyOrderMonthly

      jest.spyOn(builder, 'getRawMany').mockResolvedValue(expected)

      expect(await service.findAllOrderMonthly(filterOrderMonthlyDto)).toEqual(
        expected,
      )
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('t')
      expect(builder.select).toHaveBeenCalledWith('t.year_month', 'year_month')
      expect(builder.addSelect).toHaveBeenCalledWith('t.store_id', 'store_id')
      expect(builder.addSelect).toHaveBeenCalledWith('t.status', 'status')
      expect(builder.addSelect).toHaveBeenCalledWith('t.quantity', 'quantity')
      expect(builder.where).toHaveBeenCalledWith(
        't.year_month >= :year_month_min',
        { year_month_min: '2023-10' },
      )
      expect(builder.andWhere).toHaveBeenCalledWith(
        't.year_month <= :year_month_max',
        { year_month_max: '2023-10' },
      )
      expect(builder.andWhere).toHaveBeenCalledWith(
        't.store_id IN (:...store_ids)',
        { store_ids: [27, 13] },
      )
      expect(builder.andWhere).toHaveBeenCalledWith(
        't.status IN (:...status_list)',
        { status_list: ['pending', 'shipped'] },
      )
      expect(builder.getRawMany).toHaveBeenCalled()
    })
  })
})
