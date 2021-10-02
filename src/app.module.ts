import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { ReportsController } from './reports/reports.controller';
import { UsersService } from './users/users.service';
import { ReportsService } from './reports/reports.service';

@Module({
  imports: [],
  controllers: [AppController, UsersController, ReportsController],
  providers: [AppService, UsersService, ReportsService],
})
export class AppModule {}
