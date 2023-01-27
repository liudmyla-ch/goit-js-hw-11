import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formRef = document.querySelector('form');
const inputRef = document.querySelector('input');
const buttonSubmitRef = document.querySelector('button[type=submit]');
const buttonLoadMoreRef = document.querySelector('.load-more');
const boxImgRef = document.querySelector('div');

const BASE_URL = 'https://pixabay.com/api/';
const keyApi = '33165254-c3e62d75cf9018f52b0cf66fd';
const imageType = 'photo';
const orientationType = 'horizontal';
const safeSearch = 'true';
const perPage = '40';
let searchInput;
let page = 1;
let totalPages;
let totalHits;
let requestGallery;

formRef.addEventListener('submit', onSubmitSearch);
buttonLoadMoreRef.addEventListener('click', onLoadMoreButton);

async function onSubmitSearch(evt) {
  evt.preventDefault();
  page = 1;
  clearMarkup();
  buttonLoadMoreRef.hidden = false;
  searchInput = evt.currentTarget.searchQuery.value.trim();
  if (!searchInput ||searchInput === '' ) {
    buttonLoadMoreRef.hidden = true;
    return;
  }
 
await fetchSearchRequest(searchInput, page).then(data=>{
    totalHits = data.totalHits;
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    requestGallery = searchMarkup(data);
    lightboxMarkup(requestGallery);
}).catch(err=>console.log(err))
}


// function searchRequest(searchInput) {
//   fetchSearchRequest(searchInput).then(data => {
//     totalHits = data.totalHits;
//     Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

//     searchMarkup(data);
//   });
// }

async function fetchSearchRequest(searchInput, page) {
  const requestArr = await axios.get(
    `${BASE_URL}?key=${keyApi}&q=${searchInput}&per_page=${perPage}&page=${page}&image_type=${imageType}&orientation=${orientationType}&safesearch=${safeSearch}}`
  );
  if (requestArr.data.hits.length === 0) {
    buttonLoadMoreRef.hidden = true;
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  page+=1;
  return requestArr.data;
  
}

function searchMarkup(images) {
  console.log(images.hits);
  const markup = images.hits
    .map(image => {
      return `<a class="gallery__item" href="${image.largeImageURL}">
      <div class="photo-card">

            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
            <div class="info">
              <p class="info-item">
                <b>Likes</b>
                ${image.likes}
              </p>
              <p class="info-item">
                <b>Views</b>
                ${image.views}
              </p>
              <p class="info-item">
                <b>Comments</b>
                ${image.comments}
              </p>
              <p class="info-item">
                <b>Downloads</b>
                ${image.downloads}
              </p>
            </div>
          </div></a>`;
    })
    .join('');
  boxImgRef.insertAdjacentHTML('beforeend', markup);
}

function clearMarkup() {
  return (boxImgRef.innerHTML = '');
}

  function newLightbox() {
    let lightbox = new SimpleLightbox('.gallery .gallery__item', {
      scrollZoom: false,
      enableKeyboard: true,
      captionType: 'attr',
      captionsData: 'alt',
      captionPosition: 'bottom',
      captionDelay: 250,
    });
    lightbox.refresh();
  }

  function lightboxMarkup(markup) {
    boxImgRef.insertAdjacentHTML('beforeend', markup);
    // lightbox.refresh();
    newLightbox(markup);
    // lightbox.refresh();
  }
  
async function onLoadMoreButton(evt) {
    page += 1;
  await fetchSearchRequest(searchInput, page).then(data =>{
     requestGallery = searchMarkup(data);
     lightboxMarkup(requestGallery);
     totalPages = data.totalHits / perPage;
     if (page > totalPages) {
      buttonLoadMoreRef.hidden = true;
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      return
    }
  
  }).catch(err=> console.log(err))
  
  //   searchRequest(searchInput);
  }
  