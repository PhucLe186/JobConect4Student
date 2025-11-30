import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Likes, LikeSchema } from './likes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Likes.name, schema: LikeSchema }]),
  ],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
