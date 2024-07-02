import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CustomerService } from './customer.service'
import { Customer } from './customer.entity'
import { CustomerController } from './customer.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  providers: [CustomerService],
  controllers: [CustomerController],
})
export class CustomerModule {}
