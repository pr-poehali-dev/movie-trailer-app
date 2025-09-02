import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { kinopoiskApi, KinopoiskMovie, KinopoiskStaff } from '@/services/kinopoiskApi';
import ApiKeySetup from '@/components/ApiKeySetup';

interface MovieSearchApiProps {
  onAddToFavorites?: (movie: any) => void;
  favorites?: number[];
}

export default function MovieSearchApi({ onAddToFavorites, favorites = [] }: MovieSearchApiProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<KinopoiskMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<KinopoiskMovie | null>(null);
  const [movieStaff, setMovieStaff] = useState<KinopoiskStaff[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const checkApiKey = () => {
      const apiKey = localStorage.getItem('kinopoisk-api-key');
      setHasApiKey(!!apiKey);
    };
    
    checkApiKey();
    
    // Слушаем изменения localStorage
    window.addEventListener('storage', checkApiKey);
    return () => window.removeEventListener('storage', checkApiKey);
  }, []);

  const searchMovies = async (query: string, pageNum: number = 1) => {
    if (!query.trim()) {
      setMovies([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await kinopoiskApi.searchMovies(query, pageNum);
      
      if (pageNum === 1) {
        setMovies(response.items);
      } else {
        setMovies(prev => [...prev, ...response.items]);
      }
      
      setTotalPages(response.totalPages);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при поиске');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMovieDetails = async (movieId: number) => {
    try {
      const staff = await kinopoiskApi.getMovieStaff(movieId);
      setMovieStaff(staff);
    } catch (err) {
      console.error('Error loading movie staff:', err);
      setMovieStaff([]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    searchMovies(searchQuery, 1);
  };

  const loadMore = () => {
    if (page < totalPages) {
      searchMovies(searchQuery, page + 1);
    }
  };

  const handleMovieSelect = (movie: KinopoiskMovie) => {
    setSelectedMovie(movie);
    loadMovieDetails(movie.kinopoiskId);
  };

  const addToFavorites = (movie: KinopoiskMovie) => {
    if (onAddToFavorites) {
      const convertedMovie = kinopoiskApi.convertToAppFormat(movie, movieStaff);
      onAddToFavorites(convertedMovie);
    }
  };

  const formatDuration = (minutes: number | null): string => {
    if (!minutes) return 'Неизвестно';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}ч ${mins}мин` : `${mins}мин`;
  };

  const getDirectors = (staff: KinopoiskStaff[]): string => {
    const directors = staff.filter(s => s.professionKey === 'DIRECTOR');
    return directors.map(d => d.nameRu || d.nameEn).join(', ') || 'Неизвестно';
  };

  const getActors = (staff: KinopoiskStaff[]): string => {
    const actors = staff.filter(s => s.professionKey === 'ACTOR').slice(0, 5);
    return actors.map(a => a.nameRu || a.nameEn).join(', ') || 'Неизвестно';
  };

  if (!hasApiKey) {
    return (
      <div className="space-y-6">
        <ApiKeySetup onApiKeySet={(key) => setHasApiKey(!!key)} />
        <div className="text-center py-8">
          <Icon name="Key" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Настройте API ключ для поиска фильмов</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Поиск */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <Input
          placeholder="Поиск фильмов на Кинопоиске..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          {loading ? <Icon name="Loader2" size={16} className="animate-spin" /> : <Icon name="Search" size={16} />}
        </Button>
      </form>

      {/* Ошибка */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-destructive" />
            <span className="text-destructive text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Результаты поиска */}
      {movies.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Результаты поиска ({movies.length} из найденных)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <Dialog key={movie.kinopoiskId}>
                <DialogTrigger asChild>
                  <Card 
                    className="group cursor-pointer hover:scale-105 transition-all duration-300 bg-card border-border"
                    onClick={() => handleMovieSelect(movie)}
                  >
                    <CardContent className="p-0">
                      <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
                        <img 
                          src={movie.posterUrlPreview} 
                          alt={movie.nameRu || movie.nameEn || ''}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-movie.jpg';
                          }}
                        />
                        <div className="absolute top-2 right-2">
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="h-8 w-8 p-0 bg-primary/20 hover:bg-primary/30" 
                            onClick={(e) => {
                              e.stopPropagation();
                              addToFavorites(movie);
                            }}
                          >
                            <Icon name={favorites.includes(movie.kinopoiskId) ? "Heart" : "Plus"} size={14} />
                          </Button>
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="font-semibold text-xs mb-1 truncate">
                          {movie.nameRu || movie.nameEn || movie.nameOriginal}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{movie.year}</span>
                          {movie.ratingKinopoisk && (
                            <div className="flex items-center">
                              <Icon name="Star" size={10} className="mr-1 text-accent" />
                              {movie.ratingKinopoisk.toFixed(1)}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>

                {/* Модальное окно с деталями */}
                <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">
                      {movie.nameRu || movie.nameEn || movie.nameOriginal}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <img 
                        src={movie.posterUrl} 
                        alt={movie.nameRu || movie.nameEn || ''}
                        className="w-full rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-movie.jpg';
                        }}
                      />
                      <div className="flex flex-wrap gap-2">
                        {movie.ratingKinopoisk && (
                          <Badge variant="secondary">
                            <Icon name="Star" size={14} className="mr-1" />
                            {movie.ratingKinopoisk.toFixed(1)}
                          </Badge>
                        )}
                        {movie.year && <Badge variant="outline">{movie.year}</Badge>}
                        {movie.filmLength && <Badge variant="outline">{formatDuration(movie.filmLength)}</Badge>}
                        {movie.genres.map((genre, index) => (
                          <Badge key={index}>{genre.genre}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {movie.description && (
                        <div>
                          <h4 className="font-semibold mb-2">Описание</h4>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {movie.description}
                          </p>
                        </div>
                      )}
                      
                      {movieStaff.length > 0 && (
                        <>
                          <div>
                            <h4 className="font-semibold mb-2">Режиссер</h4>
                            <p className="text-sm">{getDirectors(movieStaff)}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">В ролях</h4>
                            <p className="text-sm text-muted-foreground">{getActors(movieStaff)}</p>
                          </div>
                        </>
                      )}
                      
                      {movie.countries.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Страна</h4>
                          <p className="text-sm">{movie.countries.map(c => c.country).join(', ')}</p>
                        </div>
                      )}
                      
                      <div className="flex space-x-3 pt-4">
                        <Button 
                          className="flex-1"
                          onClick={() => addToFavorites(movie)}
                        >
                          <Icon name={favorites.includes(movie.kinopoiskId) ? "Heart" : "Plus"} size={16} className="mr-2" />
                          {favorites.includes(movie.kinopoiskId) ? "В избранном" : "В избранное"}
                        </Button>
                        
                        {movie.webUrl && (
                          <Button variant="outline" className="flex-1" asChild>
                            <a href={movie.webUrl} target="_blank" rel="noopener noreferrer">
                              <Icon name="ExternalLink" size={16} className="mr-2" />
                              Кинопоиск
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>

          {/* Кнопка "Загрузить еще" */}
          {page < totalPages && (
            <div className="text-center">
              <Button onClick={loadMore} disabled={loading}>
                {loading ? (
                  <>
                    <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Загружаем...
                  </>
                ) : (
                  <>
                    <Icon name="ChevronDown" size={16} className="mr-2" />
                    Загрузить еще
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Пустое состояние */}
      {searchQuery && !loading && movies.length === 0 && !error && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Фильмы не найдены</p>
          <p className="text-sm text-muted-foreground">Попробуйте изменить запрос</p>
        </div>
      )}
    </div>
  );
}