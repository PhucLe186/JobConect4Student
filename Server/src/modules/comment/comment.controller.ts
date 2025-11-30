import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import type { Request } from 'express';
import { MessageDto } from './dto/Message.dto';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import { JwtAuthGuard } from '../auth/Jwt/jwt-auth.guard';

@Controller('comment')
export class CommentController {
  constructor(private readonly CommentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  async Message(@Req() res: Request, @Body() MessageDto: MessageDto) {
    return this.CommentService.Comment(res.user as JwtUser, MessageDto);
  }
}
