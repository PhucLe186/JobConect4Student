import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Forum, ForumDocument } from './forum.scheme';
import { Model, Types } from 'mongoose';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import { CreateForumDto } from './dto/createForum.dto';
import { User, UserDocument } from '../auth/schema/auth.schema';
import { Message, MessageDocument } from '../comment/message.schema';
import { LikeDocument, Likes } from '../likes/likes.schema';

@Injectable()
export class ForumService {
  constructor(
    @InjectModel(Forum.name) private ForumModel: Model<ForumDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
    @InjectModel(Likes.name) private LikeModel: Model<LikeDocument>,
  ) {}
  async Forum(current_id?: string): Promise<any[]> {
    const Posts = await this.ForumModel.find().sort({ created_at: -1 }).lean();

    const Post_id = Posts.map((post) => post._id);

    const comments = await this.MessageModel.find({
      post_id: { $in: Post_id },
    })
      .lean()
      .exec();

    const user_id = [
      ...new Set([
        ...Posts.map((p) => p.user_id.toString()),
        ...comments.map((c) => c.user_id.toString()),
      ]),
    ];
    const Likes = await this.LikeModel.aggregate([
      { $match: { post_id: { $in: Post_id } } },
      { $group: { _id: '$post_id', count: { $sum: 1 } } },
    ]);

    const LikeMap = Object.fromEntries(
      Likes.map((like) => [like._id, like.count]),
    );

    const users = await this.UserModel.find({
      _id: { $in: user_id },
    });

    const userMap = Object.fromEntries(users.map((u) => [u._id, u]));

    const finalPost = {};
    for (const i of comments) {
      if (!finalPost[i.post_id.toString()])
        finalPost[i.post_id.toString()] = [];
      finalPost[i.post_id.toString()].push({
        id: i._id.toString(),
        author:
          current_id === i.user_id.toString()
            ? 'Bạn'
            : userMap[i.user_id.toString()].name,
        content: i.content,
        time: i.created_at,
      });
    }
    console.log(finalPost);

    const result = Posts.map((item) => ({
      id: item._id.toString(),
      author:
        current_id === item.user_id.toString()
          ? 'Bạn'
          : userMap[item.user_id.toString()].name,
      content: item.content,
      image_path: item.image_path,
      time: item.created_at,
      likes: LikeMap[item._id.toString()] || 0,
      comments: finalPost[item._id.toString()] || [],
    }));
    return result;
  }

  async CreateForum(user: JwtUser, createDto: CreateForumDto): Promise<Forum> {
    const { userId } = user;
    const forum = new this.ForumModel({
      ...createDto,
      user_id: new Types.ObjectId(userId),
    });
    return forum.save();
  }
}
