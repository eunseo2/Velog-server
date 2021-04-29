import { Injectable, NotFoundException } from '@nestjs/common';
import { PostDto } from 'src/auth/dto/create-post.dto';

import { PostRepository } from 'src/entities/post.repository';

import { TagRepository } from 'src/entities/tag.repository';
import { User } from 'src/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly tagRepository: TagRepository,
  ) {
    this.postRepository = postRepository;
  }

  // front에서 cookie 값 같이 보내줘야함.

  async createPost(user: User, postdata: PostDto): Promise<void> {
    const newPost = {
      title: postdata.title,
      description: postdata.description,
      isDelete: false,
      user: user,
      tags: postdata.tags,
    };
    await this.postRepository.save(newPost);
  }

  async getAllPosts() {
    return this.postRepository.find({ relations: ['user'] });
  }

  async getPostById(id: number) {
    const post = await this.postRepository.findOne(id, {
      relations: ['user', 'tags'],
    });
    if (post) {
      return post;
    }
    throw new NotFoundException(id);
  }
}