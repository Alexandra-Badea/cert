import React, { useState, useEffect, useCallback } from 'react';
import { createNewsPost, editNewsPost, removeImageNewsPost } from '../api/api';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteImageModal from './DeleteImageModal';

function NewsForm({ postData }) {
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const [formData, setFormData] = useState({
    title: '',
    project_type: '',
    location: '',
    start_date: '',
    end_date: '',
    images: [],
    description: '',
    url: '',
    pdfFile: null,
  });

  const [error, setError] = useState({
    title: null,
    project_type: null,
    location: null,
    start_date: null,
    end_date: null,
    images: null,
    description: null,
    url: null,
    pdfFile: null,
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
      const startDate = new Date(postData.start_date);
      const formattedStartDate = startDate.toISOString().split('T')[0];

      const endDate = new Date(postData.end_date);
      const formattedEndDate = endDate.toISOString().split('T')[0];

      setFormData({
        title: postData.title,
        project_type: postData.project_type,
        location: postData.location,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        images: postData.images,
        description: postData.description,
        url: postData.url,
        pdfFile: postData.pdfFile
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

  const handlePdfChange = async (e) => {
    const pdfFile = e.target.files[0];

    setFormData(prevState => ({
      ...prevState,
      pdfFile: pdfFile
    }));
    setError({ ...error, pdfFile: '' });
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
          const response = await removeImageNewsPost(postData._id, { imageToRemove });
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
      fromDataToSend.append('project_type', formData.project_type)
      fromDataToSend.append('location', formData.location)
      fromDataToSend.append('start_date', formData.start_date)
      fromDataToSend.append('end_date', formData.end_date)
      fromDataToSend.append('description', formData.description)
      fromDataToSend.append('url', formData.url)
      fromDataToSend.append('pdfFile', formData.pdfFile)

      formData.images.filter(image => image instanceof File).forEach(newImage => {
        fromDataToSend.append('images', newImage);
      })

      if (isUpdateMode) {
        const response = await editNewsPost(postData._id, fromDataToSend);
        setServerResponse(response.data.message);
        setIsUpdateMode(false);
      } else {
        const response = await createNewsPost(fromDataToSend);
        setServerResponse(response.data.message);
      }

      setFormData({
        title: '',
        project_type: '',
        location: '',
        start_date: '',
        end_date: '',
        images: [],
        description: '',
        url: '',
        pdfFile: null
      });
    } catch (error) {
      setServerError('Server error please try again later');
    }
  }

  const validateForm = useCallback(() => {
    let valid = true;

    if (formData.title.trim() === '') {
      setError(prevState => ({ ...prevState, title: 'Please fill in a title' }));
      valid = false;
    } else {
      setError(prevState => ({ ...prevState, title: null }));
    }

    if (!formData.project_type) {
      setError(prevState => ({ ...prevState, project_type: 'Please select an option' }));
      valid = false;
    } else {
      setError(prevState => ({ ...prevState, project_type: null }));
    }

    if (formData.location.trim() === '') {
      setError(prevState => ({ ...prevState, location: 'Please fill in a location' }));
      valid = false;
    } else {
      setError(prevState => ({ ...prevState, location: null }));
    }

    if (formData.start_date.trim() === '') {
      setError(prevState => ({ ...prevState, start_date: 'Please fill in the start date' }));
      valid = false;
    } else {
      setError(prevState => ({ ...prevState, start_date: null }));
    }

    if (formData.end_date.trim() === '') {
      setError(prevState => ({ ...prevState, end_date: 'Please fill in the end date' }));
      valid = false;
    } else {
      setError(prevState => ({ ...prevState, end_date: null }));
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

    if (formData.description.trim() === '') {
      setError(prevState => ({ ...prevState, description: 'Please fill in a description' }));
      valid = false;
    } else {
      setError(prevState => ({ ...prevState, description: null }));
    }

    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    if (formData.url.trim() === '' || !urlPattern.test(formData.url)) {
      setError(prevState => ({ ...prevState, url: 'Please enter a valid URL' }));
      valid = false;
    } else {
      setError(prevState => ({ ...prevState, url: null }));
    }

    if (!formData.pdfFile) {
      setError(prevState => ({ ...prevState, pdfFile: 'Please select a PDF file' }));
      valid = false;
    } else {
      // Check if the pdfFile is a string (existing file)
      if (typeof formData.pdfFile === 'string') {
        // If it's an existing file, no need to show error
        setError(prevState => ({ ...prevState, pdfFile: null }));
      } else {
        // If it's a new file, perform validation
        if (formData.pdfFile.length < 1) {
          setError(prevState => ({ ...prevState, pdfFile: 'Please select a PDF file' }));
          valid = false;
        } else if (formData.pdfFile.length > 1) {
          setError(prevState => ({ ...prevState, pdfFile: 'Please select only one PDF file' }));
          valid = false;
        } else {
          const extension = formData.pdfFile.name.split('.').pop().toLowerCase();
          const allowedPdfFormats = ['pdf'];

          if (!allowedPdfFormats.includes(extension)) {
            setError(prevState => ({ ...prevState, pdfFile: 'Please select a PDF file' }));
            valid = false;
          } else {
            // If the file is valid, clear the error
            setError(prevState => ({ ...prevState, pdfFile: null }));
          }
        }
      }
    }

    const datePattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    if (!datePattern.test(formData.start_date)) {

      setError(prevState => ({ ...prevState, start_date: 'Invalid date format (mm/dd/yyyy)' }));
      valid = false;
    }
    if (!datePattern.test(formData.end_date)) {

      setError(prevState => ({ ...prevState, end_date: 'Invalid date format (mm/dd/yyyy)' }));
      valid = false;
    }

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    if (endDate < startDate) {
      setError(prevState => ({ ...prevState, end_date: 'End date cannot be before start date' }));
      valid = false;
    }

    return valid;
  }, [formData, isUpdateMode]);

  useEffect(() => {
    validateForm();
  }, [formData, validateForm]);

  return (
    <form encType='multipart/form-data'>
      <div className={openConfirmDeleteModal.opened ? 'modal' : ''}></div>

      <label htmlFor='title'>Title</label>
      <input type='text' id='title' name='title' value={formData.title} onChange={handleChange} required placeholder='Title' />
      {error.title && <span>{error.title}</span>}

      <label htmlFor='project_type'>Type of Project</label>
      <select name='project_type' id='project_type' value={formData.project_type} onChange={handleChange} required>
        <option value='' disabled defaultValue>Select project type</option>
        <option value='youth_exchange'>Youth Exchange</option>
        <option value='training_course'>Training Course</option>
        <option value='european_solidarity_corps'>European Solidarity Corps</option>
        <option value='solidarity_projects'>Solidarity Projects</option>
        <option value='other'>Other</option>
      </select>
      {error.project_type && <span>{error.project_type}</span>}

      <label htmlFor='location'>Location</label>
      <input type='text' id='location' name='location' value={formData.location} onChange={handleChange} required placeholder='Location' />
      {error.location && <span>{error.location}</span>}

      <label htmlFor='start_date'>Start date</label>
      <input type='date' id='start_date' name='start_date' value={formData.start_date} onChange={handleChange} required />
      {error.start_date && <span>{error.start_date}</span>}

      <label htmlFor='end_date'>End date</label>
      <input type='date' id='end_date' name='end_date' value={formData.end_date} onChange={handleChange} required />
      {error.end_date && <span>{error.end_date}</span>}

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

      <label htmlFor='description'>About the project:</label>
      <textarea id='description' name='description' value={formData.description} onChange={handleChange} required placeholder='Description...'></textarea>
      {error.description && <span>{error.description}</span>}

      <label htmlFor='url'>Link to apply:</label>
      <input type='url' id='url' name='url' value={formData.url} onChange={handleChange} required placeholder='URL' />
      {error.url && <span>{error.url}</span>}

      <input type='file' id='pdfFile' name='pdfFile' accept='application/pdf' onChange={handlePdfChange} style={{ display: 'none' }} required />
      <label htmlFor='pdfFile'>
        <div className='upload-icon'>
          <UploadFileIcon />
          <p>Upload File</p>
        </div>
      </label>

      {formData.pdfFile ?
        (typeof formData.pdfFile === 'string' ?
          <div className='pdf-preview'>
            <PictureAsPdfIcon />
            <p>{formData.pdfFile}</p>
          </div>
          :
          <div className='pdf-preview'>
            <PictureAsPdfIcon />
            <p>{formData.pdfFile.name}</p>
          </div>
        ) : ''
      }

      {error.pdfFile && <span>{error.pdfFile}</span>}

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

export default NewsForm;