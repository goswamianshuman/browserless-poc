import {
    Controller,
    Get,
    Post,
    Param,
    Body,
    UseGuards,
    Request,
    ParseUUIDPipe,
    Patch,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/gaurds/jwt_auth.gaurd';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '../users/user.entity';
import {Request as RequestProp} from 'express';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@UseGuards(JwtAuthGuard)
@Controller()
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post('orders')
    create(@Body() dto: CreateOrderDto, @Request() req: RequestProp) {
        const user = req.user as User;
        return this.ordersService.create(user, dto);
    }

    @Get('orders/my')
    findMy(@Request() req: RequestProp) {
        const user = req.user as User;
        return this.ordersService.findMyOrders(user);
    }

    @Get('orders/:id')
    findOne(
        @Param('id', ParseUUIDPipe) id: string,
        @Request() req: RequestProp,
    ) {
        const user = req.user as User;
        return this.ordersService.findOne(id, user);
    }

    // Rider: list unassigned orders
    @Get('orders/available')
    findAvailable() {
      return this.ordersService.findAvailableOrders();
    }
  
    // Rider: accept order
    @Post('orders/:id/accept')
    accept(
      @Param('id', ParseUUIDPipe) id: string,
      @Request() req: RequestProp,
    ) {
      const user = req.user as User;
      return this.ordersService.acceptOrder(id, user);
    }
  
    // Rider: update status
    @Patch('orders/:id/status')
    updateStatus(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() dto: UpdateOrderStatusDto,
      @Request() req: RequestProp,
    ) {
      const user = req.user as User;
      return this.ordersService.updateStatus(id, dto, user);
    }
}