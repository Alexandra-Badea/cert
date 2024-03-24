import React, { useEffect, useState, useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';
import { getBlogPostById, deleteBlogPost } from '../api/api';
import { AuthContext } from '../authContext';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DeleteModal from '../components/DeleteModal';
import '../styles/Posts.css';

function BlogPost() {
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const { isLoggedIn } = useContext(AuthContext);

  const { postId } = useParams();

  const navigate = useNavigate();

  const [blogPost, setBlogPost] = useState(null);
  const [showEditDeleteButtons, setShowEditDeleteButtons] = useState(false);
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState({
    deleteId: '',
    opened: false
  });
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const data = await getBlogPostById(postId);
        setBlogPost(data);
      } catch (error) {
        setServerError('An error occured, please try again later.');
      }
    };

    fetchBlogPost();
  }, [postId]);

  useEffect(() => {
    if (!isLoggedIn) {
      setShowEditDeleteButtons(false);
    } else {
      setShowEditDeleteButtons(true);
    }
  }, [isLoggedIn]);

  if (!blogPost) {
    return <div>Loading...</div>
  }

  const toggleConfirmDeleteModal = (id) => {
    setOpenConfirmDeleteModal(prevState => ({
      deleteId: id,
      opened: !prevState.opened
    }));
  }

  const handleDelete = async (postId) => {
    try {
      const response = await deleteBlogPost(postId);
      if (response.status === 200) {
        navigate('/blog');
      }
    } catch (error) {
      setServerError('An error occured, please try again later');
    }
  }

  return (
    <>
      <Header />
      <main>
      <div className={openConfirmDeleteModal.opened ? 'modal' : ''}></div>        
      {showEditDeleteButtons ?
          <div className='btn-modal'>
            <DeleteIcon className='icon icon-delete' onClick={() => toggleConfirmDeleteModal(postId)} />
            <a href={`/control-panel/dashboard?type=blog&id=${postId}`} className='icon icon-edit'><EditIcon /></a>
            {openConfirmDeleteModal.deleteId === postId && (<DeleteModal openedModal={toggleConfirmDeleteModal} handleDelete={() => handleDelete(postId)} />)}
          </div> : null}
        <div className='container-image'>
          {Array.isArray(blogPost.images) && blogPost.images.map((imageUrl, index) => (
            <img key={index} className='image-post' src={`${baseUrl}/images/${imageUrl}`} alt={index + 1} />
          ))}
        </div>
        <h1>{blogPost.title}</h1>
        <p className='content'>{blogPost.content}</p>
        <p className='author'><em>Author: {blogPost.author}</em></p>

        {serverError && <p>{serverError}</p>}
      </main>
      <Footer />
    </>
  )
}

export default BlogPost;