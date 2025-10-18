import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import About from './pages/About';
import Home from './pages/Home';
import Blogs, { blogsLoader } from './pages/Blogs';
import BlogPost, { blogPostLoader } from './pages/BlogPost';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  {
    path: '/blogs',
    element: <Blogs />,
    loader: blogsLoader,
  },
  {
    path: '/blogs/:id',
    element: <BlogPost />,
    loader: blogPostLoader,
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
