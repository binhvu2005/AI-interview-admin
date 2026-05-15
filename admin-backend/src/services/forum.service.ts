import ForumPost from '../models/forum.model';

export const fetchAllPosts = async () => {
  const posts = await ForumPost.find()
    .populate('author', 'fullName email isVip')
    .sort({ date: -1 });
  return posts;
};

export const updateVisibility = async (postId: string) => {
  const post = await ForumPost.findById(postId);
  if (!post) throw new Error('Post not found');
  
  post.isHidden = !post.isHidden;
  await post.save();
  
  return { message: `Post ${post.isHidden ? 'hidden' : 'visible'}`, isHidden: post.isHidden };
};
