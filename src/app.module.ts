import { Module } from '@nestjs/common'; 
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { TypeOrmModule } from '@nestjs/typeorm'; 
import configuration from './config/configuration';

@Module({ 
  imports: [ 
    ConfigModule.forRoot({ isGlobal: true, load: [configuration], }), 
    TypeOrmModule.forRootAsync({ 
      imports: [ConfigModule], 
      inject: [ConfigService], 
      useFactory: 
      (config: ConfigService) => ({ 
        type: 'postgres', 
        host: config.get('database.host'), 
        port: config.get<number>('database.port'), 
        username: config.get('database.username'), 
        password: config.get('database.password'), 
        database: config.get('database.name'), 
        synchronize: true, 
        autoLoadEntities: true, 
      }), 
    }), 
  ], 
}) 

export class AppModule {}