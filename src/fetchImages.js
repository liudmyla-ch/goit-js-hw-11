import axios from 'axios';

const baseUrl = 'https://pixabay.com/api';
const KEY = '33165254-c3e62d75cf9018f52b0cf66fd';

export async function fetchImages(query, page) {
    const response = await axios.get(
      `${baseUrl}/?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    );
    return response;
  }