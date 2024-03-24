import React, { useEffect, useState, useCallback, useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';
import { getAllProjectPosts, deleteProjectPost } from '../api/api';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { AuthContext } from '../authContext';
import DeleteModal from '../components/DeleteModal';
import '../styles/PostsList.css';

function ProjectsList() {
  const { isLoggedIn } = useContext(AuthContext);

  const { projectType } = useParams();
  
  const [projectPosts, setProjectPosts] = useState([]);
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

  const fetchProjectPosts = useCallback(async () => {
    try {
      const data = await getAllProjectPosts(projectType);
      setProjectPosts(data);
    } catch (error) {
      setServerError('An error occured, please try again later.');
    }
  }, [projectType]);

  useEffect(() => {
    fetchProjectPosts();
  }, [fetchProjectPosts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setServerResponse(null);
      setServerError(null);
    }, 3000);
  
    return () => clearTimeout(timer);
  }, [serverResponse, serverError]);

  const toggleConfirmDeleteModal = (id) => {
    setOpenConfirmDeleteModal(prevState => ({
      deleteId: id,
      opened: !prevState.opened
    }));
  }

  const handleDelete = async (postId) => {
    try {
      const response = await deleteProjectPost(postId);
      if (response.status === 200) {
        setServerResponse(response.data.message);
        fetchProjectPosts();
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
        {projectPosts.length === 0 ? (
          <p>No projects available!</p>
        ) : (
          <ol className='posts'>
            {projectPosts.map(post => (
              <li key={post._id}>
                <div>
                  <Link to={`/projects/${post.project_type}/${post._id}`}><h1>{post.title}</h1></Link>
                  <p>{post.description.slice(0, 150) + '...'}</p>
                </div>

                {showEditDeleteButtons ?
                  <div className='btn-modal'>
                    <DeleteIcon className='icon icon-delete' onClick={() => toggleConfirmDeleteModal(post._id)} />
                    <a href={`/control-panel/dashboard?type=projects&id=${post._id}`} className='icon icon-edit'><EditIcon /></a>
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

export default ProjectsList;