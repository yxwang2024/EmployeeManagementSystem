import axios from 'axios';

const token: string = localStorage.getItem('token') || '';
const prefix = 'http://localhost:3000';

interface errType {
  message: string
}

const request = async <T>(query: string='', variables: object = {}): Promise<T> => {
  const response = await axios.post(`${prefix}/graphql`, {
    query,
    variables,
  }, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 401) {
    localStorage.clear();
    window.location.href = '/signin';
    return Promise.reject(new Error('Unauthorized'));
  } 
  if (response.status === 200 || response.status === 201) {
    return response.data as Promise<T>;
  } else {
    const err: errType = await response.data.errors[0];
    return Promise.reject(new Error(err.message));
  }
};

const fileUploadRequest = async <T>(query: string, title: string, file: File): Promise<T> => {
  const formData = new FormData();
  formData.append('operations', JSON.stringify({
    query: query,
    operationName: "CreateDocument",
    variables: {
      input: {
        title,
        file: null, // Placeholder for the file
      },
      "input.file": null, // Placeholder for the file
    },
  }));
  formData.append('map', JSON.stringify({
    '0': ['variables.input.file'],
  }));
  formData.append('0', file);
  console.log("file", formData); 
  const response = await axios.post(`${prefix}/graphql`, formData, {
    headers: {
      "Accept": "application/json",
      "X-XSRF-TOKEN": token,
      "x-apollo-operation-name": "UploadDocument",
      "Authorization": `Bearer ${token}`,
    },
  });
  if (response.status === 401) {
    localStorage.clear();
    window.location.href = '/signin';
    return Promise.reject(new Error('Unauthorized'));
  } 
  if (response.status === 200 || response.status === 201) {
    return response.data as Promise<T>;
  } else {
    const err: errType = await response.data.errors[0];
    return Promise.reject(new Error(err.message));
  }
}

export { request, fileUploadRequest };