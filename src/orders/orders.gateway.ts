import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { Injectable, Logger } from '@nestjs/common';
  import { Order } from './order.entity';
  
  @WebSocketGateway({ namespace: '/orders', cors: true })
  @Injectable()
  export class OrdersGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
  {
    @WebSocketServer() server: Server;
    private readonly logger = new Logger('OrdersGateway');
  
    afterInit(server: Server) {
      this.logger.log('OrdersGateway initialized');
    }
  
    handleConnection(client: Socket) {
      this.logger.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      this.logger.log(`Client disconnected: ${client.id}`);
    }
  
    /** Customer (or UI) joins the room for a specific order */
    @SubscribeMessage('joinOrderRoom')
    handleJoinOrderRoom(
      @MessageBody() data: { orderId: string },
      @ConnectedSocket() client: Socket,
    ) {
      const room = `order_${data.orderId}`;
      client.join(room);
      this.logger.log(`Client ${client.id} joined room ${room}`);
    }
  
    /** Restaurant owner joins their restaurant room */
    @SubscribeMessage('joinRestaurantRoom')
    handleJoinRestaurantRoom(
      @MessageBody() data: { restaurantId: string },
      @ConnectedSocket() client: Socket,
    ) {
      const room = `restaurant_${data.restaurantId}`;
      client.join(room);
      this.logger.log(`Client ${client.id} joined room ${room}`);
    }
  
    /** Emit when an order is created */
    broadcastOrderCreated(order: Order) {
      const room = `restaurant_${order.restaurant.id}`;
      this.server.to(room).emit('orderCreated', order);
      this.logger.log(`orderCreated emitted to room ${room}`);
    }
  
    /** Emit when an order’s status changes */
    broadcastOrderStatusUpdated(order: Order) {
      const room = `order_${order.id}`;
      this.server.to(room).emit('orderStatusUpdated', order);
      this.logger.log(`orderStatusUpdated emitted to room ${room}`);
    }
  }
  