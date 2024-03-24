import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './authContext';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import About from './pages/About';
import ProjectsList from './pages/ProjectsList';
import ProjectPost from './pages/ProjectPost';
import NewsList from './pages/NewsList';
import NewsPost from './pages/NewsPost';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Authentication from './pages/Authentication';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';

if (process.env.NODE_ENV === 'production') disableReactDevTools();

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/projects/:projectType',
    element: <ProjectsList />
  },
  {
    path: '/projects/:projectType/:projectId',
    element: <ProjectPost />
  },
  {
    path: '/news',
    element: <NewsList />
  },
  {
    path: '/news/:newsId',
    element: <NewsPost />
  },
  {
    path: '/blog',
    element: <BlogList />
  },
  {
    path: '/blog/:postId',
    element: <BlogPost />
  },
  {
    path: '/contact',
    element: <Contact />
  },
  {
    path: '/control-panel/dashboard',
    element: <Dashboard />
  },
  {
    path: '/login',
    element: <Authentication />
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
