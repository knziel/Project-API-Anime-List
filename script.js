const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsDiv = document.getElementById('results');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const resultsTitle = document.getElementById('results-title');
const paginationDiv = document.getElementById('pagination');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const modalTitle = document.getElementById('modal-title');
const modalImage = document.getElementById('modal-image');
const modalType = document.getElementById('modal-type');
const modalGenres = document.getElementById('modal-genres');
const modalAired = document.getElementById('modal-aired');
const modalStudio = document.getElementById('modal-studio');
const modalProducers = document.getElementById('modal-producers');
const modalScore = document.getElementById('modal-score');
const modalRank = document.getElementById('modal-rank');
const modalEpisodes = document.getElementById('modal-episodes');
const modalStatus = document.getElementById('modal-status');
const modalPopularity = document.getElementById('modal-popularity');
const modalRating = document.getElementById('modal-rating');
const modalSynopsis = document.getElementById('modal-synopsis');
const modalTrailer = document.getElementById('modal-trailer');
const modalCharacters = document.getElementById('characters-list');
const modalStaff = document.getElementById('staff-list');
const closeModal = document.getElementById('close-modal');

// Debounce function to limit API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Fetch characters for an anime
async function fetchCharacters(animeId) {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/characters`);
        if (!response.ok) return [];
        const data = await response.json();
        return data.data.slice(0, 6);
    } catch (error) {
        console.error('Error fetching characters:', error);
        return [];
    }
}

// Fetch staff for an anime
async function fetchStaff(animeId) {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/staff`);
        if (!response.ok) return [];
        const data = await response.json();
        return data.data.slice(0, 4);
    } catch (error) {
        console.error('Error fetching staff:', error);
        return [];
    }
}

// Show modal with anime details
async function showModal(anime) {
    modalTrailer.innerHTML = '';
    modalCharacters.innerHTML = '';
    modalStaff.innerHTML = '';
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        modalContent.scrollTop = 0;
    }, 0);
    if (!anime) {
        modalTitle.textContent = 'Error';
        modalImage.src = '';
        modalImage.alt = 'No image';
        modalType.textContent = '';
        modalGenres.textContent = '';
        modalAired.textContent = '';
        modalStudio.textContent = '';
        modalProducers.textContent = '';
        modalScore.textContent = '';
        modalRank.textContent = '';
        modalEpisodes.textContent = '';
        modalStatus.textContent = '';
        modalPopularity.textContent = '';
        modalRating.textContent = '';
        modalSynopsis.textContent = 'Failed to load anime details.';
        modalTrailer.innerHTML = '';
        modalCharacters.innerHTML = '<p class="text-gray-300 text-sm">No characters available.</p>';
        modalStaff.innerHTML = '<p class="text-gray-300 text-sm">No staff available.</p>';
        modal.classList.remove('hidden');
        return;
    }
    const characters = await fetchCharacters(anime.mal_id);
    const staff = await fetchStaff(anime.mal_id);
    modalTitle.textContent = anime.title || 'No title available';
    modalImage.src = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || '';
    modalImage.alt = anime.title || 'Anime image';
    modalType.textContent = `Type: ${anime.type || 'N/A'}`;
    modalGenres.textContent = `Genres: ${anime.genres?.map(g => g.name).join(', ') || 'N/A'}`;
    modalAired.textContent = `Aired: ${anime.aired?.string || 'N/A'}`;
    modalStudio.textContent = `Studio: ${anime.studios?.[0]?.name || 'N/A'}`;
    modalProducers.textContent = `Producers: ${anime.producers?.map(p => p.name).join(', ') || 'N/A'}`;
    modalScore.textContent = `Score: ${anime.score || 'N'}`;
    modalRank.textContent = `Rank: #${anime.rank || 'N/A'}`;
    modalEpisodes.textContent = `Episodes: ${anime.episodes || 'N/A'}`;
    modalStatus.textContent = `Status: ${anime.status || 'N/A'}`;
    modalPopularity.textContent = `Popularity: #${anime.popularity || 'N/A'}`;
    modalRating.textContent = `Rating: ${anime.rating || 'N/A'}`;
    modalSynopsis.textContent = anime.synopsis || 'No synopsis available.';
    // Trailer with thumbnail (prevents auto-play)
    if (anime.trailer?.youtube_id) {
        const videoId = anime.trailer.youtube_id;
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        modalTrailer.innerHTML = `
            <div class="relative cursor-pointer" onclick="this.outerHTML='<iframe class=\\'w-full h-64 rounded-md\\' src=\\'https://www.youtube.com/embed/${videoId}?autoplay=0\\' frameborder=\\'0\\' allow=\\'clipboard-write; encrypted-media; gyroscope; picture-in-picture\\' allowfullscreen></iframe>'">
                <img src="${thumbnailUrl}" alt="Trailer thumbnail" class="w-full h-64 object-cover rounded-md">
                <div class="absolute inset-0 flex items-center justify-center">
                    <svg class="w-12 h-12 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
            </div>
        `;
    } else {
        modalTrailer.innerHTML = '<p class="text-gray-300 text-sm">No trailer available.</p>';
    }
    if (characters.length > 0) {
        characters.forEach(char => {
            const charDiv = document.createElement('div');
            charDiv.className = 'flex items-center';
            charDiv.innerHTML = `
                        <img src="${char.character.images?.jpg?.image_url || ''}" alt="${char.character.name || 'Character'}" class="w-14 h-18 object-cover rounded-md mr-2" loading="lazy">
                        <div>
                            <p class="text-gray-300 text-sm font-semibold">${char.character.name || 'N/A'}</p>
                            <p class="text-gray-400 text-xs">${char.role || 'N/A'}</p>
                        </div>
                    `;
            modalCharacters.appendChild(charDiv);
        });
    } else {
        modalCharacters.innerHTML = '<p class="text-gray-300 text-sm">No characters available.</p>';
    }
    if (staff.length > 0) {
        staff.forEach(person => {
            const staffDiv = document.createElement('div');
            staffDiv.className = 'flex items-center';
            staffDiv.innerHTML = `
                <img src="${person.person.images?.jpg?.large_image_url || person.person.images?.jpg?.image_url || 'path/to/placeholder-staff.jpg'}" alt="${person.person.name || 'Staff'}" class="w-20 h-auto object-contain rounded-md mr-2" loading="lazy">
                <div>
                    <p class="text-gray-300 text-sm font-semibold">${person.person.name || 'N/A'}</p>
                    <p class="text-gray-400 text-xs">${person.positions?.join(', ') || 'N/A'}</p>
                </div>
            `;
            modalStaff.appendChild(staffDiv);
        });
    } else {
        modalStaff.innerHTML = '<p class="text-gray-300 text-sm">No staff available.</p>';
    }
    modal.classList.remove('hidden');
}

// Close modal
function closeModalFunc() {
    modal.classList.add('hidden');
    modalTrailer.innerHTML = '';
    modalContent.scrollTop = 0;
    document.body.style.overflow = '';
}

// Close modal with button
closeModal.addEventListener('click', closeModalFunc);

// Close modal by clicking overlay
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModalFunc();
    }
});

// Prevent clicks inside modal content from closing the modal
modalContent.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Prevent modal scroll from affecting background
modalContent.addEventListener('wheel', (e) => {
    const delta = e.deltaY;
    const atTop = modalContent.scrollTop === 0;
    const atBottom = modalContent.scrollTop + modalContent.clientHeight >= modalContent.scrollHeight;
    if ((atTop && delta < 0) || (atBottom && delta > 0)) {
        e.preventDefault();
    }
}, { passive: false });

modalContent.addEventListener('touchmove', (e) => {
    const atTop = modalContent.scrollTop === 0;
    const atBottom = modalContent.scrollTop + modalContent.clientHeight >= modalContent.scrollHeight;
    const touch = e.touches[0];
    const direction = touch.clientY - (touch.clientY - e.deltaY || 0);
    if ((atTop && direction > 0) || (atBottom && direction < 0)) {
        e.preventDefault();
    }
}, { passive: false });

// Close modal with Esc key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModalFunc();
    }
});

// Encode JSON for data attribute
function encodeAnimeData(anime) {
    return btoa(encodeURIComponent(JSON.stringify(anime)));
}

// Decode JSON from data attribute
function decodeAnimeData(encoded) {
    try {
        return JSON.parse(decodeURIComponent(atob(encoded)));
    } catch (e) {
        console.error('Error decoding anime data:', e);
        return null;
    }
}

// Render pagination buttons
function renderPagination(currentPage, lastPage, isSearch, query = '') {
    paginationDiv.innerHTML = '';
    if (lastPage <= 1) return;

    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(lastPage, startPage + maxButtons - 1);
    if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }

    // Previous button
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.className = 'px-3 py-1 bg-gray-700 text-blue-400 rounded-md hover:bg-blue-600 hover:text-white transition';
        prevButton.textContent = 'Previous';
        prevButton.addEventListener('click', () => {
            isSearch ? fetchAnime(query, currentPage - 1) : fetchTopAnime(currentPage - 1);
        });
        paginationDiv.appendChild(prevButton);
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `px-3 py-1 rounded-md transition ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-700 text-blue-400 hover:bg-blue-600 hover:text-white'}`;
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            isSearch ? fetchAnime(query, i) : fetchTopAnime(i);
        });
        paginationDiv.appendChild(pageButton);
    }

    // Next button
    if (currentPage < lastPage) {
        const nextButton = document.createElement('button');
        nextButton.className = 'px-3 py-1 bg-gray-700 text-blue-400 rounded-md hover:bg-blue-600 hover:text-white transition';
        nextButton.textContent = 'Next';
        nextButton.addEventListener('click', () => {
            isSearch ? fetchAnime(query, currentPage + 1) : fetchTopAnime(currentPage + 1);
        });
        paginationDiv.appendChild(nextButton);
    }
}

// Fetch anime data from API
async function fetchAnime(query, page = 1) {
    try {
        loadingDiv.classList.remove('hidden');
        errorDiv.classList.add('hidden');
        resultsDiv.innerHTML = '';
        resultsTitle.textContent = 'Top Search Results';

        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&page=${page}`);
        if (!response.ok) throw new Error('Failed to fetch data from API');

        const data = await response.json();
        const animeList = data.data;
        const pagination = data.pagination;

        if (animeList.length === 0) {
            errorDiv.textContent = 'No anime found for your search.';
            errorDiv.classList.remove('hidden');
            paginationDiv.innerHTML = '';
            return;
        }

        animeList.forEach(anime => {
            const card = document.createElement('div');
            card.className = 'bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-neon transition cursor-pointer';
            card.setAttribute('data-anime', encodeAnimeData(anime));
            card.innerHTML = `
                <img src="${anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || ''}" alt="${anime.title || 'Anime image'}" class="w-full h-auto max-h-96 object-contain rounded-md mb-4" loading="lazy">
                <h2 class="text-xl font-semibold text-blue-400">${anime.title || 'No title'}</h2>
                <p class="text-gray-400 text-sm mt-2 line-clamp-3">${anime.synopsis || 'No synopsis available.'}</p>
            `;
            card.addEventListener('click', () => {
                const encoded = card.getAttribute('data-anime');
                const anime = decodeAnimeData(encoded);
                showModal(anime);
            });
            resultsDiv.appendChild(card);
        });

        renderPagination(pagination.current_page, pagination.last_visible_page, true, query);
    } catch (error) {
        errorDiv.textContent = 'An error occurred while fetching data. Please try again later.';
        errorDiv.classList.remove('hidden');
        paginationDiv.innerHTML = '';
    } finally {
        loadingDiv.classList.add('hidden');
    }
}

// Fetch top anime
async function fetchTopAnime(page = 1) {
    try {
        loadingDiv.classList.remove('hidden');
        errorDiv.classList.add('hidden');
        resultsDiv.innerHTML = '';
        resultsTitle.textContent = 'Top Anime';

        const response = await fetch(`https://api.jikan.moe/v4/top/anime?limit=6&page=${page}`);
        if (!response.ok) throw new Error('Failed to fetch top anime');

        const data = await response.json();
        const animeList = data.data;
        const pagination = data.pagination;

        animeList.forEach(anime => {
            const card = document.createElement('div');
            card.className = 'bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-neon transition cursor-pointer';
            card.setAttribute('data-anime', encodeAnimeData(anime));
            card.innerHTML = `
                <img src="${anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || ''}" alt="${anime.title || 'Anime image'}" class="w-full h-auto max-h-96 object-contain rounded-md mb-4" loading="lazy">
                <h2 class="text-xl font-semibold text-blue-400">${anime.title || 'No title'}</h2>
                <p class="text-gray-400 text-sm mt-2 line-clamp-3">${anime.synopsis || 'No synopsis available.'}</p>
            `;
            card.addEventListener('click', () => {
                const encoded = card.getAttribute('data-anime');
                const anime = decodeAnimeData(encoded);
                showModal(anime);
            });
            resultsDiv.appendChild(card);
        });

        renderPagination(pagination.current_page, pagination.last_visible_page, false);
    } catch (error) {
        errorDiv.textContent = 'An error occurred while fetching top anime. Please try again later.';
        errorDiv.classList.remove('hidden');
        paginationDiv.innerHTML = '';
    } finally {
        loadingDiv.classList.add('hidden');
    }
}

// Handle form submission
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        fetchAnime(query, 1);
    } else {
        fetchTopAnime(1);
    }
});

// Debounced input event for real-time search
const debouncedSearch = debounce((query) => {
    if (query) {
        fetchAnime(query, 1);
    } else {
        fetchTopAnime(1);
    }
}, 500);

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    debouncedSearch(query);
});

// Load top anime on page load
window.addEventListener('load', () => fetchTopAnime(1));