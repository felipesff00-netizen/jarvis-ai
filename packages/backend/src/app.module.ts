import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DevicesModule } from './devices/devices.module';
import { SkillsModule } from './skills/skills.module';
import { ToolsModule } from './tools/tools.module';
import { TasksModule } from './tasks/tasks.module';
import { MemoryModule } from './memory/memory.module';
import { PermissionsModule } from './permissions/permissions.module';
import { CommonModule } from './common/common.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'jarvis_user'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME', 'jarvis_ai_dev'),
        entities: [path.join(__dirname, '**/*.entity{.ts,.js}')],
        migrations: [path.join(__dirname, 'database/migrations/*{.ts,.js}')],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
        logging: configService.get<boolean>('DB_LOGGING', false),
        migrationsRun: true,
      }),
    }),
    CommonModule,
    HealthModule,
    AuthModule,
    UsersModule,
    DevicesModule,
    SkillsModule,
    ToolsModule,
    TasksModule,
    MemoryModule,
    PermissionsModule,
  ],
})
export class AppModule {}
