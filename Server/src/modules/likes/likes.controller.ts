import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/Jwt/jwt-auth.guard';
import type { Request } from 'express';
import { JwtUser } from '../auth/interface/jwt-user.interface';

@Controller('likes')
export class LikesController {
  constructor(private readonly LikeService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  async Like(@Req() req: Request, @Body('post_id') post_id: string) {
    return this.LikeService.Like(post_id, req.user as JwtUser);
  }
}
