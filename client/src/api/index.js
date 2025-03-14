import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8080/api/v1/' });


export const fetchPosts = () => API.get(`/posts`);
export const fetchPost = (id) => API.get(`/posts/${id}`);

export const createPost = (newpost) => API.post(`/posts`,newpost);

export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);

export const deletePost = (id) => API.delete(`/posts/${id}`);


export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);