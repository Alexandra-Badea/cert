import React, { useEffect, useState, useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';
import { getProjectPostById, deleteProjectPost } from '../api/api';
import { AuthContext } from '../authContext';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DeleteModal from '../components/DeleteModal';
import '../styles/Posts.css';

function ProjectPost() {
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const { projectType, projectId } = useParams();

  const [projectPost, setProjectPost] = useState(null);
  const [showEditDeleteButtons, setShowEditDeleteButtons] = useState(false);
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState({
    deleteId: '',
    opened: false
  });
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    const fetchProjectPost = async () => {
      try {
        const data = await getProjectPostById(projectType, projectId);
        setProjectPost(data);
      } catch (error) {
        setServerError('An error occured, please try again later.');
      }
    };

    fetchProjectPost();
  }, [projectType, projectId]);

  useEffect(() => {
    if (!isLoggedIn) {
      setShowEditDeleteButtons(false);
    } else {
      setShowEditDeleteButtons(true);
    }
  }, [isLoggedIn]);

  if (!projectPost) {
    return <div>Loading...</div>
  }

  const startDate = new Date(projectPost.start_date).toLocaleDateString('en-GB');
  const endDate = new Date(projectPost.end_date).toLocaleDateString('en-GB');

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
        navigate(`/projects/${projectType}`);
      }
    } catch (error) {
      setServerError('An error occured, please try again later.');
    }
  }

  return (
    <>
      <Header />
      <main>
        <div className={openConfirmDeleteModal.opened ? 'modal' : ''}></div>
        {showEditDeleteButtons ?
          <div className='btn-modal'>
            <DeleteIcon className='icon icon-delete' onClick={toggleConfirmDeleteModal} />
            <a href={`/control-panel/dashboard?type=projects&id=${projectId}`} className='icon icon-edit'><EditIcon /></a>
            {openConfirmDeleteModal.deleteId === projectId && (<DeleteModal openedModal={toggleConfirmDeleteModal} handleDelete={() => handleDelete(projectId)} />)}
          </div> : null}
        <h1>{projectPost.title}</h1>
        <h2>Type: {projectPost.project_type}</h2>
        <p><strong>Location: {projectPost.location}</strong></p>
        <p><em>Date: {startDate} - {endDate}</em></p>
        <div className='container-image'>
          {Array.isArray(projectPost.images) && projectPost.images.map((imageUrl, index) => (
            <img key={index} className='image-post' src={`${baseUrl}/images/${imageUrl}`} alt={index + 1} />
          ))}
        </div>
        <p className='content'>{projectPost.description}</p>
        <p className='content'>{projectPost.opinion}</p>

        {serverError && <p>{serverError}</p>}
      </main>
      <Footer />
    </>
  )
}

export default ProjectPost;