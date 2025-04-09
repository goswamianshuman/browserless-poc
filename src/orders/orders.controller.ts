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
import { RolesGuard } from 'src/common/gaurds/roles.gaurd';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { User, UserRole } from '../users/user.entity';
import { Request as RequestProp } from 'express';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('orders')
  @Roles(UserRole.Customer)
  @ApiOperation({ summary: 'Place a new order (Customer)' })
  @ApiResponse({ status: 201, description: 'Order placed successfully' })
  create(@Body() dto: CreateOrderDto, @Request() req: RequestProp) {
    const user = req.user as User;
    return this.ordersService.create(user, dto);
  }

  @Get('orders/my')
  @Roles(UserRole.Customer, UserRole.DeliveryRider)
  @ApiOperation({ summary: 'Get my orders (Customer or Rider)' })
  @ApiResponse({ status: 200, description: 'List of your orders' })
  findMy(@Request() req: RequestProp) {
    const user = req.user as User;
    return this.ordersService.findMyOrders(user);
  }

  @Get('orders/:id')
  @Roles(UserRole.Customer, UserRole.DeliveryRider)
  @ApiOperation({ summary: 'Get a specific order (Customer or Rider)' })
  @ApiResponse({ status: 200, description: 'Order details' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: RequestProp,
  ) {
    const user = req.user as User;
    return this.ordersService.findOne(id, user);
  }

  @Get('orders/available')
  @Roles(UserRole.DeliveryRider)
  @ApiOperation({ summary: 'List available orders (Rider)' })
  @ApiResponse({ status: 200, description: 'Unassigned orders list' })
  findAvailable() {
    return this.ordersService.findAvailableOrders();
  }

  @Post('orders/:id/accept')
  @Roles(UserRole.DeliveryRider)
  @ApiOperation({ summary: 'Accept an order (Rider)' })
  @ApiResponse({ status: 200, description: 'Order accepted' })
  accept(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: RequestProp,
  ) {
    const user = req.user as User;
    return this.ordersService.acceptOrder(id, user);
  }

  @Patch('orders/:id/status')
  @Roles(UserRole.DeliveryRider)
  @ApiOperation({ summary: 'Update delivery status (Rider)' })
  @ApiResponse({ status: 200, description: 'Order status updated' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderStatusDto,
    @Request() req: RequestProp,
  ) {
    const user = req.user as User;
    return this.ordersService.updateStatus(id, dto, user);
  }
}
