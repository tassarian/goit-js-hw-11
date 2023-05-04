const axios = require('axios/dist/browser/axios.cjs');

export class PixabayApi {
    #BASE_URL = 'https://pixabay.com/api/';
    #API_KEY = '35960135-b5affa7a28418b398b23cde19';
    constructor() {
        this.page = null,
        this.searchQuery = '',
        this.perPage = 40
    };

    fetchImagesByQuery() {
        const searchParams = {
            q: this.searchQuery,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            page: this.page,
            per_page: this.perPage,
            key: this.#API_KEY
        };
        return axios.get(`${this.#BASE_URL}`, { params: searchParams });
    };

    getRandomImages() {
        const searchParams = {
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            page: this.page,
            key: this.#API_KEY
            
        };
        return axios.get(`${this.#BASE_URL}`, { params: searchParams });
    }

    

};