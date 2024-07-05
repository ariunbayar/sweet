import { Test, TestingModule } from '@nestjs/testing'
import { ReportController } from './report.controller'
import { ReportService } from './report.service'
import { OrderStatus } from '../order/enums/order-status.enum'

describe('ReportController', () => {
  let controller: ReportController
  let service: ReportService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [
        {
          provide: ReportService,
          useValue: {
            findAllOrderMonthly: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<ReportController>(ReportController)
    service = module.get<ReportService>(ReportService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('findAllOrderMonthly()', () => {
    it('should return order monthly data', async () => {
      const filterOrderMonthlyDto = {
        year_month_min: '2023-10',
        year_month_max: '2023-10',
        store_ids: [27, 13],
        status_list: [OrderStatus.PENDING, OrderStatus.SHIPPED],
      }
      const expected = [
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

      jest.spyOn(service, 'findAllOrderMonthly').mockResolvedValue(expected)

      const result = await controller.findAllOrderMonthly(filterOrderMonthlyDto)

      expect(result).toEqual(expected)
      expect(service.findAllOrderMonthly).toHaveBeenCalledWith(
        filterOrderMonthlyDto,
      )
    })
  })
})
