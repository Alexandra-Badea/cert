import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const api = axios.create({
    baseURL: 'https://cert-api.onrender.com/api',
})

const getMethod = async (route) => {
    try {
        const response = await api.get(route);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const getMethodById = async (route) => {
    try {
        const response = await api.get(route);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const postMethod = async (route , data) => {
    try {
        const response = await api.post(route, data);
        return response;
    } catch (error) {
        throw error;
    }
}

const deleteMethod = async (route) => {
    try {
        const response = await api.delete(route);
        return response;
    } catch (error) {
        throw error;
    }
}

const editMethod = async (route, data) => {
    try {
        const resposne = await api.put(route, data);
        return resposne;
    } catch (error) {
        throw error;
    }
}

const removeImageMethod = async (route, data) => {
    try {
        const response = await api.delete(route, { data });
        return response;
    } catch (error) {
        throw error;
    }
}

export const getAllBlogPosts = async () => {
    return getMethod('/blog');
};

export const getBlogPostById = async (postId) => {
    return getMethodById(`/blog/${postId}`);
}

export const createBlogPost = async (postData) => {
    return postMethod('/blogposts', postData);
}

export const getAllProjectPosts = async (projectType) => {
    return getMethod(`/projects/${projectType}`);
}

export const getProjectPostById = async (projectType, projectId) => {
    return getMethodById(`/projects/${projectType}/${projectId}`);
}

export const createProjectPost = async (postData) => {
    return postMethod('/projectposts', postData);
}

export const getAllNewsPosts = async () => {
    return getMethod('/news');
}

export const getNewsPostById = async (newsId) => {
    return getMethodById(`/news/${newsId}`);
}

export const createNewsPost = async (postData) => {
    return postMethod('/newsposts', postData);
}

export const getCredentials = async (credentials) => {
    return postMethod('/login', credentials);
}

export const setAuthToken = (token) => {
    cookies.set('token', token,  Object.assign({
        path: '/', maxAge: 604800}));
}

export const removeAuthToken = () => {
    cookies.set('token', '', { path: '/', expires: (new Date(Date.now())) });
}

export const submitContactForm = async (formData) => {
    return postMethod('/submit-contact', formData);
}

export const deleteNewsPost = async (postId) => {
    return deleteMethod(`/news/${postId}`);
}

export const deleteBlogPost = async (postId) => {
    return deleteMethod(`/blog/${postId}`);
}

export const deleteProjectPost = async (postId) => {
    return deleteMethod(`/projects/${postId}`);
}

export const editBlogPost = async (postId, data) => {
    return editMethod(`/blog/${postId}`, data)
}

export const editProjectPost = async (postId, data) => {
    return editMethod(`/projects/${postId}`, data);
}

export const editNewsPost = async (postId, data) => {
    return editMethod(`/news/${postId}`, data);
}

export const removeImageBlogPost = async (postId, data) => {
    return removeImageMethod(`/blog/remove-image/${postId}`, data);
}

export const removeImageProjectPost = async (postId, data) => {
    return removeImageMethod(`/projects/remove-image/${postId}`, data);
}

export const removeImageNewsPost = async (postId, data) => {
    return removeImageMethod(`/news/remove-image/${postId}`, data);
}