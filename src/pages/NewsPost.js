import React, { useEffect, useState, useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';
import { getNewsPostById, deleteNewsPost } from '../api/api';
import { AuthContext } from '../authContext';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DeleteModal from '../components/DeleteModal';
import '../styles/Posts.css';

function NewsPost() {
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const { newsId } = useParams();

  const [newsPost, setNewsPost] = useState(null);
  const [showEditDeleteButtons, setShowEditDeleteButtons] = useState(false);
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState({
    deleteId: '',
    opened: false
  });
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    const fetchNewsPost = async () => {
      try {
        const data = await getNewsPostById(newsId);
        setNewsPost(data);
      } catch (error) {
        setServerError('An error occured, please try again later.');
      }
    }

    fetchNewsPost();
  }, [newsId]);

  useEffect(() => {
    if (!isLoggedIn) {
      setShowEditDeleteButtons(false);
    } else {
      setShowEditDeleteButtons(true);
    }
  }, [isLoggedIn]);

  if (!newsPost) {
    return <div>Loading...</div>
  }

  const startDate = new Date(newsPost.start_date).toLocaleDateString('en-GB');
  const endDate = new Date(newsPost.end_date).toLocaleDateString('en-GB');

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
        navigate('/news');
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
            <DeleteIcon className='icon icon-delete' onClick={() => toggleConfirmDeleteModal(newsId)} />
            <a href={`/control-panel/dashboard?type=news&id=${newsId}`} className='icon icon-edit'><EditIcon /></a>
            {openConfirmDeleteModal.deleteId === newsId && (<DeleteModal openedModal={toggleConfirmDeleteModal} handleDelete={() => handleDelete(newsId)} />)}
          </div> : null}
        <h1>{newsPost.title}</h1>
        <h2>Type: {newsPost.project_type}</h2>
        <p><strong>Location: {newsPost.location}</strong></p>
        <p><em>Date: {startDate} - {endDate}</em></p>
        <a href={newsPost.url} target='_blank' rel='noopener noreferrer' className='link'><AppRegistrationIcon /> Apply</a>

        <div className='container-image'>
          {Array.isArray(newsPost.images) && newsPost.images.map((imageUrl, index) => (
            <img key={index} className='image-post' src={`${baseUrl}/images/${imageUrl}`} alt={index + 1} />
          ))}
        </div>
        <p className='content'>{newsPost.description}</p>

        <a href={`${baseUrl}/files/${newsPost.pdfFile}`} download='filename.pdf' target='_balnk' className='link'><CloudDownloadIcon /> Info-Pack</a>

        {serverError && <p>{serverError}</p>}
      </main>
      <Footer />
    </>
  )
}

export default NewsPost;