import { Blog } from '@baseline/types/blog';
import { RequestHandler } from './request-handler';

export const getBlog = async (requestHandler: RequestHandler, blogId: string): Promise<Blog> => {
  const response = await requestHandler.request<Blog>({
    method: 'GET',
    url: `blog/${blogId}`,
    hasAuthentication: true,
  });
  if ('data' in response) {
    return response.data;
  }
  throw response;
};

export const getAllBlogs = async (requestHandler: RequestHandler): Promise<Blog[]> => {
  const response = await requestHandler.request<Blog[]>({
    method: 'GET',
    url: `blog/list`,
    hasAuthentication: true,
  });
  if ('data' in response) {
    return response.data;
  }
  throw response;
};

export const deleteBlog = async (requestHandler: RequestHandler, blogId: string): Promise<boolean> => {
  const response = await requestHandler.request<boolean>({
    method: 'DELETE',
    url: `blog/${blogId}`,
    hasAuthentication: true,
  });
  if ('data' in response) {
    return response.data;
  }
  throw response;
};

export const createBlog = async (
  requestHandler: RequestHandler,
  blog: Partial<Blog>,
): Promise<Blog> => {
  const response = await requestHandler.request<Blog>({
    method: 'POST',
    url: `blog`,
    hasAuthentication: true,
    data: blog,
  });
  if ('data' in response) {
    return response.data;
  }
  throw response;
};

export const updateBlog = async (
  requestHandler: RequestHandler,
  blog: Partial<Blog>,
): Promise<Blog> => {
  const response = await requestHandler.request<Blog>({
    method: 'PATCH',
    url: `blog`,
    hasAuthentication: true,
    data: blog,
  });
  if ('data' in response) {
    return response.data;
  }
  throw response;
};
