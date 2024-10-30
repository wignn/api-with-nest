import { BookmarkService } from './bookmark.service';
import { Controller, Post } from '@nestjs/common';

@Controller('bookmark')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService) {}
    
    @Post()
    async createBookmark() {
        
    }
}
