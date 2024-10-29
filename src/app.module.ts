import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { userModule } from './user/user.module';
import { MailerModule } from './mailer/mailer.module';
import { bookModule } from './book/book.module';
import { GenreModule } from './genre/genre.module';
import { BookmarkModule } from './bookmark/bookmark.module';

@Module({
  imports: [
    CommonModule,
    userModule,
    MailerModule,
    userModule,
    bookModule,
    GenreModule,
    BookmarkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
