import { Injectable } from '@nestjs/common';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './message.schema';
import { Model, Types } from 'mongoose';
import { MessageDto } from './dto/Message.dto';
import { User, UserDocument } from '../auth/schema/auth.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
  ) {}

  async Comment(user: JwtUser, MessageDto: MessageDto): Promise<any> {
    const { userId } = user;
    const { post_id, content } = MessageDto;

    const newMessage = await this.MessageModel.create({
      user_id: new Types.ObjectId(userId),
      post_id: new Types.ObjectId(post_id),
      content,
    });

    const result = {
      id: newMessage?._id.toString(),
      author: 'Bạn',
      content: newMessage?.content,
      time: newMessage?.created_at,
    };

    return result;
  }
}
