import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ForumService } from './forum.service';
import type { Request } from 'express';
import { CreateForumDto } from './dto/createForum.dto';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import { JwtAuthGuard } from '../auth/Jwt/jwt-auth.guard';
import { OptionAuthGuard } from '../auth/Jwt/jwt-option.authguagd';

@Controller('forum')
export class ForumController {
  constructor(private readonly ForumService: ForumService) {}

  @UseGuards(OptionAuthGuard)
  @Get('')
  async getForum(@Req() req) {
    const current_id = req.user?.userId;
    return this.ForumService.Forum(current_id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  async CreateForum(
    @Req() req: Request,
    @Body() createForumDto: CreateForumDto,
  ) {
    return this.ForumService.CreateForum(req.user as JwtUser, createForumDto);
  }
}
