import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './tasks/infrastructure/entity/task.entity';
import { TaskModule } from './tasks/task.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '54.37.137.106',
      port: 5432,
      password: 'changeme',
      username: 'postgres',
      entities: [Task],
      database: 'sternx',
      synchronize: true,
      logging: true,
      ssl: false,
    }),
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
