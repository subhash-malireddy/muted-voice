import { Response } from 'express';
import { blogMapper } from './blog';
import { isAdmin } from '../../middleware/is-admin';
import { RequestContext } from '../../util/request-context.type';
import { Blog } from '@baseline/types/blog';
import { getErrorMessage } from '../../util/error-message';
import createApp from '../../util/express-app';
import createAuthenticatedHandler from '../../util/create-authenticated-handler';
import { blogService } from './blog.service';

const app = createApp();
// app.use(isAdmin); // All private endpoints require the user to be an admin
export const handler = createAuthenticatedHandler(app);

app.post('/blog', [
  isAdmin,
  async (req: RequestContext, res: Response) => {
    try {
      const { title, content, author, isPublished } = req.body as Blog;
      const blogData: Partial<Blog> = {
        title,
        content,
        author,
        isPublished,
      };
      const blog = await blogService.create(blogData);
      res.json(blogMapper(blog));
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to create blog ${message}`);
      res.status(400).json({ error: 'Failed to create blog' });
    }
  },
]);

app.patch('/blog', [
  isAdmin,
  async (req: RequestContext, res: Response) => {
    try {
      const { blogId, title, content, author, isPublished } = req.body as Blog;
      const blogData: Partial<Blog> = {
        blogId,
        title,
        content,
        author,
        isPublished,
      };
      const blog = await blogService.update(blogData);
      res.json(blogMapper(blog));
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to update blog: ${message}`);
      res.status(400).json({
        error: 'Failed to update blog',
      });
    }
  },
]);

app.delete('/blog/:blogId', [
  isAdmin,
  async (req: RequestContext, res: Response) => {
    try {
      const blogId = req.params.blogId;
      await blogService.delete(blogId);
      res.status(200);
      res.send();
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to delete blog: ${message}`);
      res.status(400).json({
        error: 'Failed to delete blog',
      });
    }
  },
]);

app.get('/blog/list', [
  isAdmin,
  async (req: RequestContext, res: Response) => {
    try {
      const blogs = await blogService.getAll();
      const formattedBlogs = blogs.map(blogMapper);
      res.json(formattedBlogs);
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to get blogs: ${message}`);
      res.status(400).json({
        error: 'Failed to get blogs',
      });
    }
  },
]);

app.get('/blog/:blogId', [
  isAdmin,
  async (req: RequestContext, res: Response) => {
    try {
      const blog = await blogService.get(req.params.blogId);
      res.json(blogMapper(blog));
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to get blog: ${message}`);
      res.status(400).json({
        error: 'Failed to get blog',
      });
    }
  },
]);
