import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LikeDocument, Likes } from './likes.schema';
import { Model, Types } from 'mongoose';
import { JwtUser } from '../auth/interface/jwt-user.interface';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Likes.name) private LikeModel: Model<LikeDocument>,
  ) {}

  async Like(post_id: string, user: JwtUser): Promise<{ status: string }> {
    const { userId } = user;

    const checkLike = await this.LikeModel.findOne({
      post_id: new Types.ObjectId(post_id),
      user_id: new Types.ObjectId(userId),
    });
    if (checkLike) {
      throw new BadRequestException('bạn đã like rồi bài viết này rồi');
    }

    await this.LikeModel.create({
      post_id: new Types.ObjectId(post_id),
      user_id: new Types.ObjectId(userId),
    });
    return { status: 'ok' };
  }
}
