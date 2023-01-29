import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './fetchImages';
import Notiflix from 'notiflix';
import { pageScrolling } from './pageScrolling';

let page = 1;
let gallery = new SimpleLightbox('div.gallery a', {
  scrollZoom: false,
  enableKeyboard: true,
  captionType: 'attr',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});


const options = {
  root: null,
  rootMargin: '250px',
  threshold: 1.0,
};


const formRef = document.querySelector('#search-form');
const boxImageRef = document.querySelector('.gallery');
const inputRef = document.querySelector('input');
const boxGuardRef = document.querySelector('.js-guard');

let inputSearch;

formRef.addEventListener('submit', onSubmitForm);


function onSubmitForm(e) {
  
clearInput();
inputSearch = inputRef.value.trim();
if (!inputSearch){
  return;
}
  e.preventDefault();
  page = 1;
  getData(inputSearch, page);
}

async function getData(query, page) {
  try {
    const data = await fetchImages(query, page);
    renderImages(data);
    gallery.refresh();
    observer.observe(boxGuardRef);
    return data;
  } catch (error) {
    console.log(error.message);
  }
}

let observer = new IntersectionObserver(onLoad, options);

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      getData(inputRef.value, page).then(data => {
        const {
          data: { hits },
        } = data;

        if (page === 13 || hits.length < 40) {
          observer.unobserve(boxGuardRef);
        }
      });
    }
  });
}

function renderImages({ data: { hits: arrOfImages }, data: { totalHits } }) {
  notificationsForCustomer(arrOfImages, totalHits);

  const markup = arrOfImages
    .map(image => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;

      return `<div class="photo-card">
  <a href="${largeImageURL}" class="gallery__item"><img src="${webformatURL}" alt="${tags}" class="gallery__image"  loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div></a>`;
    })
    .join('');

  boxImageRef.insertAdjacentHTML('beforeend', markup);
}

function notificationsForCustomer(arrOfImages, totalHits) {
  if (page === 1 && arrOfImages.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  if (page > totalHits / 40 && arrOfImages.length !== 0) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }

  if (page === 1 && arrOfImages.length !== 0) {
    console.log(page);
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }
}

function clearInput(){
  boxImageRef.innerHTML="";
}


