import { Module } from '@nestjs/common';
import { ForumController } from './forum.controller';
import { ForumService } from './forum.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Forum, ForumSchema } from './forum.scheme';
import { User, UserSchema } from '../auth/schema/auth.schema';
import { Message, MessageSchema } from '../comment/message.schema';
import { Likes, LikeSchema } from '../likes/likes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Forum.name, schema: ForumSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([{ name: Likes.name, schema: LikeSchema }]),
  ],
  controllers: [ForumController],
  providers: [ForumService],
})
export class ForumModule {}
