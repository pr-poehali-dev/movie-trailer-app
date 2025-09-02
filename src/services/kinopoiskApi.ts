export interface KinopoiskMovie {
  kinopoiskId: number;
  nameRu: string | null;
  nameEn: string | null;
  nameOriginal: string | null;
  posterUrl: string;
  posterUrlPreview: string;
  coverUrl: string | null;
  logoUrl: string | null;
  reviewsCount: number;
  ratingGoodReview: number | null;
  ratingGoodReviewVoteCount: number | null;
  ratingKinopoisk: number | null;
  ratingKinopoiskVoteCount: number | null;
  ratingImdb: number | null;
  ratingImdbVoteCount: number | null;
  ratingFilmCritics: number | null;
  ratingFilmCriticsVoteCount: number | null;
  ratingAwait: number | null;
  ratingAwaitCount: number | null;
  ratingRfCritics: number | null;
  ratingRfCriticsVoteCount: number | null;
  webUrl: string;
  year: number | null;
  filmLength: number | null;
  slogan: string | null;
  description: string | null;
  shortDescription: string | null;
  editorAnnotation: string | null;
  isTicketsAvailable: boolean;
  productionStatus: string | null;
  type: string;
  ratingMpaa: string | null;
  ratingAgeLimits: string | null;
  hasImax: boolean | null;
  has3D: boolean | null;
  lastSync: string;
  countries: Array<{
    country: string;
  }>;
  genres: Array<{
    genre: string;
  }>;
  startYear: number | null;
  endYear: number | null;
  serial: boolean | null;
  shortFilm: boolean | null;
  completed: boolean | null;
}

export interface KinopoiskSearchResponse {
  total: number;
  totalPages: number;
  items: KinopoiskMovie[];
}

export interface KinopoiskStaff {
  staffId: number;
  nameRu: string | null;
  nameEn: string | null;
  description: string | null;
  posterUrl: string;
  professionText: string;
  professionKey: string;
}

class KinopoiskApiService {
  private readonly baseUrl = 'https://kinopoiskapiunofficial.tech/api';
  private apiKey: string;

  constructor(apiKey: string = '') {
    this.apiKey = apiKey;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  getApiKey(): string {
    return this.apiKey || localStorage.getItem('kinopoisk-api-key') || '';
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key].toString());
      }
    });

    const currentApiKey = this.getApiKey();
    if (!currentApiKey) {
      throw new Error('API ключ не настроен. Добавьте ключ в настройках.');
    }

    const response = await fetch(url.toString(), {
      headers: {
        'X-API-KEY': currentApiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async searchMovies(
    keyword: string, 
    page: number = 1,
    yearFrom?: number,
    yearTo?: number,
    ratingFrom?: number,
    ratingTo?: number,
    genres?: string[],
    countries?: string[]
  ): Promise<KinopoiskSearchResponse> {
    const params: Record<string, any> = {
      keyword,
      page,
    };

    if (yearFrom) params.yearFrom = yearFrom;
    if (yearTo) params.yearTo = yearTo;
    if (ratingFrom) params.ratingFrom = ratingFrom;
    if (ratingTo) params.ratingTo = ratingTo;
    if (genres && genres.length > 0) params.genres = genres.join(',');
    if (countries && countries.length > 0) params.countries = countries.join(',');

    return this.makeRequest<KinopoiskSearchResponse>('/v2.1/films/search-by-keyword', params);
  }

  async getMovieDetails(id: number): Promise<KinopoiskMovie> {
    return this.makeRequest<KinopoiskMovie>(`/v2.2/films/${id}`);
  }

  async getMovieStaff(id: number): Promise<KinopoiskStaff[]> {
    return this.makeRequest<KinopoiskStaff[]>(`/v1/staff?filmId=${id}`);
  }

  async getTopMovies(type: 'TOP_100_POPULAR_FILMS' | 'TOP_250_BEST_FILMS' | 'VAMPIRE_THEME', page: number = 1): Promise<KinopoiskSearchResponse> {
    return this.makeRequest<KinopoiskSearchResponse>('/v2.2/films/top', {
      type,
      page
    });
  }

  async getPremieres(year: number, month: 'JANUARY' | 'FEBRUARY' | 'MARCH' | 'APRIL' | 'MAY' | 'JUNE' | 'JULY' | 'AUGUST' | 'SEPTEMBER' | 'OCTOBER' | 'NOVEMBER' | 'DECEMBER'): Promise<{
    total: number;
    items: KinopoiskMovie[];
  }> {
    return this.makeRequest(`/v2.2/films/premieres?year=${year}&month=${month}`);
  }

  // Конвертация данных Кинопоиска в формат нашего приложения
  convertToAppFormat(movie: KinopoiskMovie, staff?: KinopoiskStaff[]): {
    id: number;
    title: string;
    year: number;
    rating: number;
    image: string;
    genre: string;
    duration: string;
    plot: string;
    director: string;
    cast: string[];
  } {
    const directors = staff?.filter(s => s.professionKey === 'DIRECTOR') || [];
    const actors = staff?.filter(s => s.professionKey === 'ACTOR').slice(0, 5) || [];

    return {
      id: movie.kinopoiskId,
      title: movie.nameRu || movie.nameEn || movie.nameOriginal || 'Без названия',
      year: movie.year || 0,
      rating: movie.ratingKinopoisk || movie.ratingImdb || 0,
      image: movie.posterUrl,
      genre: movie.genres.map(g => g.genre).join(', ') || 'Неизвестно',
      duration: movie.filmLength ? `${movie.filmLength} мин` : 'Неизвестно',
      plot: movie.description || movie.shortDescription || 'Описание отсутствует',
      director: directors.map(d => d.nameRu || d.nameEn).join(', ') || 'Неизвестно',
      cast: actors.map(a => a.nameRu || a.nameEn).filter(Boolean) as string[]
    };
  }
}

// Создаем экземпляр сервиса
export const kinopoiskApi = new KinopoiskApiService();

export default KinopoiskApiService;