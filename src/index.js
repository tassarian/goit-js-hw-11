import { PixabayApi } from "./js/fetchImages";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsPosition: 'bottom',
  captionsDelay: 250,
  captionsData: 'alt',
  scrollZoom: false
});

const pixabayApi = new PixabayApi();

const showRandomImages = async () => {
  if (pixabayApi.searchQuery === '') {
    try {
      const { data } = await pixabayApi.getRandomImages();
      galleryBox.innerHTML = createImgCard(data.hits);
      lightbox.refresh();
    } catch (err) {
      console.log(err);
    }
  }
}

showRandomImages()

const searchFormEl = document.querySelector('.search-form');

const galleryBox = document.querySelector('.gallery');

const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.classList.add('is-hidden');

const onSearchFormSubmit = async (e) => {
    e.preventDefault();
    pixabayApi.page = 1;
    pixabayApi.searchQuery = e.currentTarget.searchQuery.value.trim();
  
    try {
      const { data } = await pixabayApi.fetchImagesByQuery();

      if (data.hits.length === 0) {
        cleanData();
        throw new Error('Sorry, there are no images matching your search query. Please try again.')
        
      }
      if (data.totalHits > 40) {
        loadMoreBtn.classList.remove('is-hidden');
        loadMoreBtn.addEventListener('click', loadMoreImg)
      }
      if (data.totalHits <= 40) {
        loadMoreBtn.classList.add('is-hidden');
      }
      
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)

      galleryBox.innerHTML = createImgCard(data.hits);

      lightbox.refresh();

      
      
    } catch (err) {
        Notiflix.Notify.failure(err.message);
  }
}

const loadMoreImg = async () => {
  pixabayApi.page += 1
  try {
    const { data } = await pixabayApi.fetchImagesByQuery();
    galleryBox.insertAdjacentHTML('beforeend', createImgCard(data.hits));

    if (pixabayApi.page === Math.ceil(data.totalHits / pixabayApi.perPage)) {
      loadMoreBtn.classList.add('is-hidden');
      throw new Error("We're sorry, but you've reached the end of search results.")
    }

  } catch (err) {
    Notiflix.Notify.failure(err.message)
  }
  
}

function createImgCard(imgList) {
    const imgCard = imgList.reduce((acc, img) => acc +
        `<div class="photo-card">
        <a href="${img.largeImageURL}">
        <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" width="300" height="180"/>
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${img.likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${img.views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${img.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${img.downloads}
          </p>
        </div>
      </div>`
      , '');
    return imgCard
}

function cleanData() {
  galleryBox.innerHTML = ""
  loadMoreBtn.classList.add('is-hidden');
  pageCount = 1
}

searchFormEl.addEventListener('submit', onSearchFormSubmit)







