import React, { useEffect, useState, useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getAllBlogPosts, deleteBlogPost } from '../api/api';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { AuthContext } from '../authContext';
import DeleteModal from '../components/DeleteModal';
import '../styles/PostsList.css';

function BlogList() {
  const { isLoggedIn } = useContext(AuthContext);
  const [blogPosts, setBlogPosts] = useState([]);
  const [showEditDeleteButtons, setShowEditDeleteButtons] = useState(false);
  const [serverResponse, setServerResponse] = useState(null);
  const [serverError, setServerError] = useState(null);
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState({
    deleteId: '',
    opened: false
  });

  useEffect(() => {
    if (!isLoggedIn) {
      setShowEditDeleteButtons(false);
    } else {
      setShowEditDeleteButtons(true);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setServerResponse(null);
      setServerError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [serverResponse, serverError]);


  const fetchBlogPosts = async () => {
    try {
      const data = await getAllBlogPosts();
      setBlogPosts(data);
    } catch (error) {
      setServerError('An error occured, please try again later.');
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

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
        setServerResponse(response.data.message);
        fetchBlogPosts();
      }
    } catch (error) {
      setServerError('Server error please try again later');
    }
  }

  return (
    <>
      <Header />
      <main>
        <div className={openConfirmDeleteModal.opened ? 'modal' : ''}></div>
        {blogPosts.length === 0 ? (
          <p>No articles available!</p>
        ) : (
          <ol className='posts'>
            {blogPosts.map(post => (
              <li key={post._id}>
                <div>
                  <Link to={`/blog/${post._id}`}><h1>{post.title}</h1></Link>
                  <p>{post.content.slice(0, 150) + '...'}</p>
                  <span><em>{post.author}</em></span>
                </div>

                {showEditDeleteButtons ?
                  <div className='btn-modal'>
                    <DeleteIcon className='icon icon-delete' onClick={() => toggleConfirmDeleteModal(post._id)} />
                    <a href={`/control-panel/dashboard?type=blog&id=${post._id}`} className='icon icon-edit'><EditIcon /></a>
                    {openConfirmDeleteModal.deleteId === post._id && (<DeleteModal openedModal={toggleConfirmDeleteModal} handleDelete={() => handleDelete(post._id)} />)}
                  </div> : null}
              </li>
            ))}
          </ol>
        )}
        <div>
          {serverResponse && <p>{serverResponse}</p>}
          {serverError && <p>{serverError}</p>}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default BlogList;