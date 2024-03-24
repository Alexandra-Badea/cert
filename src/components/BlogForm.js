import React, { useEffect, useState, useCallback } from 'react';
import { createBlogPost, editBlogPost, removeImageBlogPost } from '../api/api';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import DeleteImageModal from './DeleteImageModal';

function BlogForm({ postData }) {
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const [formData, setFormData] = useState({
    title: '',
    images: [],
    content: '',
    author: ''
  });

  const [error, setError] = useState({
    title: null,
    images: null,
    content: null,
    author: null
  });

  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState({
    deleteId: '',
    opened: false
  });
  const [serverResponse, setServerResponse] = useState(null);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    if (postData) {
      setFormData({
        title: postData.title,
        images: postData.images,
        content: postData.content,
        author: postData.author
      });
      setIsUpdateMode(true);
    }
  }, [postData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setServerResponse(null);
      setServerError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [serverResponse, serverError]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError({ ...error, [name]: '' });
    setServerResponse(null);
  }

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    setFormData(prevState => ({
      ...prevState,
      images: [...prevState.images, ...files]
    }));
    setError({ ...error, images: '' });
    setServerResponse(null);
  }

  const toggleConfirmDeleteModal = (id) => {
    setOpenConfirmDeleteModal(prevState => ({
      deleteId: id,
      opened: !prevState.opened
    }));
  }

  const handleRemoveImage = async (index, e) => {
    e.preventDefault();

    if (formData.images.length === 1) {
      setOpenConfirmDeleteModal({ deleteId: '', opened: false });
      setError({ ...error, images: 'Form must have at least one image' });
      return;
    }

    if (isUpdateMode) {
      const imageToRemove = formData.images[index];

      try {
        if (typeof imageToRemove === 'string') {
          const response = await removeImageBlogPost(postData._id, { imageToRemove });
          if (response.status === 200) {
            const newImages = formData.images.filter((img, idx) => idx !== index);
            setFormData({ ...formData, images: newImages });

            setOpenConfirmDeleteModal({ deleteId: '', opened: false });
          }
          setServerResponse(response.data.message);
        } else {
          const newImages = formData.images.filter((img, idx) => idx !== index);
          setFormData({ ...formData, images: newImages });
          setError(prevState => ({ ...prevState, images: null }));

          setOpenConfirmDeleteModal({ deleteId: '', opened: false });
        }
      } catch (error) {
        setServerError('Server error please try again later');
      }
    } else {
      const newImages = formData.images.filter((img, idx) => idx !== index);
      setFormData({ ...formData, images: newImages });
      setError({ ...error, images: '' });

      setOpenConfirmDeleteModal({ deleteId: '', opened: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!validateForm()) {
        return;
      }

      const fromDataToSend = new FormData();

      fromDataToSend.append('title', formData.title)
      fromDataToSend.append('content', formData.content)
      fromDataToSend.append('author', formData.author)

      formData.images.filter(image => image instanceof File).forEach(newImage => {
        fromDataToSend.append('images', newImage);
      })

      if (isUpdateMode) {
        const response = await editBlogPost(postData._id, fromDataToSend);
        setServerResponse(response.data.message);
        setIsUpdateMode(false);
      } else {
        const response = await createBlogPost(fromDataToSend);
        setServerResponse(response.data.message);
      }

      setFormData({
        title: '',
        images: [],
        content: '',
        author: ''
      });

    } catch (error) {
      setServerError('Server error please try again later');
    }
  };

  const validateForm = useCallback(() => {
    let valid = true;

    if (formData.title.trim() === '') {
      setError(prevState => ({ ...prevState, title: 'Please fill in a title' }));
      valid = false;
    } else {
      setError(prevState => ({ ...prevState, title: null }));
    }

    if (!formData.images || formData.images.length === 0) {
      setError(prevState => ({ ...prevState, images: 'Please select at least one image' }));
      valid = false;
    } else {
      setError(prevState => ({ ...prevState, images: null }));

      if (formData.images.length > 4) {
        setError(prevState => ({ ...prevState, images: 'You can select up to four images' }));
        valid = false;
      } else {
        formData.images.forEach(file => {
          const allowedImageFormats = ['jpg', 'jpeg', 'png'];
          let extension = '';

          if (isUpdateMode && typeof file === 'string') {
            const extArray = file.lastIndexOf('.');

            if (extArray !== -1) {
              extension = file.substring(extArray + 1).toLowerCase();
            }
          } else {
            extension = file.name.split('.').pop().toLowerCase();
          }

          if (!allowedImageFormats.includes(extension)) {
            setError(prevState => ({ ...prevState, images: 'Please select images with jpg, jpeg, or png format' }));
            valid = false;
          }
        });
      }
    }

    if (formData.content.trim() === '') {
      setError(prevState => ({ ...prevState, content: 'Please fill in the content' }));
      valid = false;
    } else {
      setError(prevState => ({ ...prevState, content: null }));
    }

    if (formData.author.trim() === '') {
      setError(prevState => ({ ...prevState, author: 'Please fill in the author' }));
      valid = false;
    } else {
      setError(prevState => ({ ...prevState, author: null }));
    }

    return valid;
  }, [formData, isUpdateMode]);

  useEffect(() => {
    validateForm();
  }, [formData, validateForm]);

  return (
    <form encType='multipart/form-data'>
      <div className={openConfirmDeleteModal.opened ? 'modal' : ''}></div>

      <label htmlFor='title'>Title:</label>
      <input type='text' id='title' name='title' value={formData.title} onChange={handleChange} required placeholder='Title' />
      {error.title && <span>{error.title}</span>}

      <label htmlFor='images' className='file-upload'>Select images:
        {(formData.images.length === 0 || formData.images.length < 4) && (
          <>
            <input type='file' id='images' name='images[]' accept='image/jpeg, image/png, image/jpg' multiple onChange={handleFileChange} required />
            <AddIcon className='add-sign' />
          </>
        )}
      </label>
      {formData.images.length > 0 && (
        <div className='selected-images'>
          {formData.images.map((image, index) => (
            <div key={index} className="image-container">
              <ClearIcon onClick={() => toggleConfirmDeleteModal(index)} className="remove-image" />
              {openConfirmDeleteModal.deleteId === index && (<DeleteImageModal openedModal={toggleConfirmDeleteModal} handleRemoveImage={(e) => handleRemoveImage(index, e)} />)}

              {typeof image === 'string' ? (
                <img src={`${baseUrl}/images/${image}`} alt={`img ${index + 1}`} className="image-preview" />
              ) : (
                <img src={URL.createObjectURL(image)} alt={`img ${index + 1}`} className="image-preview" />
              )}
            </div>
          ))}
        </div>
      )}
      {error.images && <span>{error.images}</span>}

      <label htmlFor='content'>Content</label>
      <textarea id='content' name='content' value={formData.content} onChange={handleChange} required placeholder='Content...'></textarea>
      {error.content && <span>{error.content}</span>}

      <label htmlFor='author'>Author:</label>
      <input type='text' id='author' name='author' value={formData.author} onChange={handleChange} required placeholder='Author' />
      {error.author && <span>{error.author}</span>}

      <div>
        {serverResponse && <p>{serverResponse}</p>}
        {serverError && <p>{serverError}</p>}
      </div>

      {isUpdateMode ? (
        <button type='submit' onClick={handleSubmit}>Update</button>
      ) : (
        <button type='submit' onClick={handleSubmit}>POST</button>
      )}
    </form>
  )
}

export default BlogForm;