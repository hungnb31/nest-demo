import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { ReportsController } from './reports/reports.controller';
import { UsersService } from './users/users.service';
import { ReportsService } from './reports/reports.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [],
      synchronize: true,
    }),
  ],
  controllers: [AppController, UsersController, ReportsController],
  providers: [AppService, UsersService, ReportsService],
})
export class AppModule {}
