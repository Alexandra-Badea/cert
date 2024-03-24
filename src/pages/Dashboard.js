import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../authContext';
import { getBlogPostById, getProjectPostById, getNewsPostById } from '../api/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProjectsForm from '../components/ProjectsForm';
import NewsForm from '../components/NewsForm';
import BlogForm from '../components/BlogForm';
import '../styles/Dashboard.css';
import '../styles/Form.css';

let editLink = null;

function Dashboard() {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
    const postType = urlParams.get('type');
    const postId = urlParams.get('id');

  const [loading, setLoading] = useState(true);
  const [postData, setPostData] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState('Projects');

  useEffect(() => {
    if (!isLoggedIn) {
      editLink = window.location.href.split('/dashboard')[1];
      navigate('/login');
    } else {
      setLoading(false);
      if (editLink) {
        navigate(editLink);
      }
    }
  }, [isLoggedIn, navigate, postType, postId]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        if (postType && postId) {
          let post;
          if (postType === 'projects') {
            post = await getProjectPostById(postType, postId);
          } else if (postType === 'news') {
            post = await getNewsPostById(postId);
          } else if (postType === 'blog') {
            post = await getBlogPostById(postId);
          }
          setActiveMenuItem(postType.charAt(0).toUpperCase() + postType.slice(1));
          setPostData(post);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    fetchData();
  }, [postType, postId]);

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
    setPostData(null);
    navigate('/control-panel/dashboard', { replace: true });
  };

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Header />
          <main>
            <h1>Dashboard</h1>
            <ul className='menu'>
              <li className={activeMenuItem === 'Projects' ? 'active-form' : ''} onClick={() => handleMenuItemClick('Projects')}>Project</li>
              <li className={activeMenuItem === 'News' ? 'active-form' : ''} onClick={() => handleMenuItemClick('News')}>News</li>
              <li className={activeMenuItem === 'Blog' ? 'active-form' : ''} onClick={() => handleMenuItemClick('Blog')}>Blog</li>
            </ul>

            {activeMenuItem === 'Projects' && <ProjectsForm postData={postData} />}
            {activeMenuItem === 'News' && <NewsForm postData={postData} />}
            {activeMenuItem === 'Blog' && <BlogForm postData={postData} />}
          </main>
          <Footer />
        </>
      )}

    </>
  )
}

export default Dashboard;