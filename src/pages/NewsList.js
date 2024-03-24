import React, { useEffect, useState, useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getAllNewsPosts, deleteNewsPost } from '../api/api';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { AuthContext } from '../authContext';
import DeleteModal from '../components/DeleteModal';
import '../styles/PostsList.css';

function NewsList() {
  const { isLoggedIn } = useContext(AuthContext);

  const [newsPosts, setNewsPosts] = useState([]);
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


  const fetchNewsPosts = async () => {
    try {
      const data = await getAllNewsPosts();
      setNewsPosts(data);
    } catch (error) {
      setServerError('An error occured, please try again later');
    }
  }

  useEffect(() => {
    fetchNewsPosts();
  }, []);

  const toggleConfirmDeleteModal = (id) => {
    setOpenConfirmDeleteModal(prevState => ({
      deleteId: id,
      opened: !prevState.opened
    }));
  }

  const handleDelete = async (postId) => {
    try {
      const response = await deleteNewsPost(postId);
      if (response.status === 200) {
        setServerResponse(response.data.message);
        fetchNewsPosts();
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
        {newsPosts.length === 0 ? (
          <p>No news available!</p>
        ) : (
          <ol className='posts'>
            {newsPosts.map(post => (
              <li key={post._id}>
                <div>
                  <Link to={`/news/${post._id}`}><h1>{post.title}</h1></Link>
                  <p>{post.description.slice(0, 150) + '...'}</p>
                </div>

                {showEditDeleteButtons ?
                  <div className='btn-modal'>
                    <DeleteIcon className='icon icon-delete' onClick={() => toggleConfirmDeleteModal(post._id)} />
                    <a href={`/control-panel/dashboard?type=news&id=${post._id}`} className='icon icon-edit'><EditIcon /></a>
                    {openConfirmDeleteModal.deleteId === post._id && (<DeleteModal openedModal={toggleConfirmDeleteModal} handleDelete={() => handleDelete(post._id)} />)}
                  </div>
                  : null}
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

export default NewsList;