import { Module } from '@nestjs/common';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DocumentsModule } from './documents/documents.module';
import { FilieresModule } from './filieres/filieres.module';
import { LevelsModule } from './levels/levels.module';
import { CategoriesModule } from './categories/categories.module';
import { SearchModule } from './search/search.module';
import { ModulesModule } from './modules/modules.module';
import { SupabaseModule } from './supabase/supabase.module';
import { HealthModule } from './health/health.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: { index: false },
    }),
    PrismaModule,
    AuthModule,
    DocumentsModule,
    FilieresModule,
    LevelsModule,
    CategoriesModule,
    SearchModule,
    ModulesModule,
    SupabaseModule,
    HealthModule,
    MessagesModule,
  ],
})
export class AppModule {}
