import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { kinopoiskApi, KinopoiskMovie, KinopoiskStaff } from '@/services/kinopoiskApi';

interface MovieSearchByIdProps {
  onAddToFavorites?: (movie: any) => void;
  favorites?: number[];
}

export default function MovieSearchById({ onAddToFavorites, favorites = [] }: MovieSearchByIdProps) {
  const [movieId, setMovieId] = useState('');
  const [movie, setMovie] = useState<KinopoiskMovie | null>(null);
  const [movieStaff, setMovieStaff] = useState<KinopoiskStaff[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchById = async (id: string) => {
    if (!id.trim()) return;
    
    const numericId = parseInt(id.trim());
    if (isNaN(numericId)) {
      setError('ID должен быть числом');
      return;
    }

    setLoading(true);
    setError(null);
    setMovie(null);
    setMovieStaff([]);

    try {
      // Получаем информацию о фильме
      const movieData = await kinopoiskApi.getMovieDetails(numericId);
      setMovie(movieData);
      
      // Получаем информацию о команде
      try {
        const staff = await kinopoiskApi.getMovieStaff(numericId);
        setMovieStaff(staff);
      } catch (staffError) {
        console.warn('Не удалось загрузить информацию о команде:', staffError);
        setMovieStaff([]);
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('404')) {
          setError('Фильм с таким ID не найден');
        } else if (err.message.includes('API ключ')) {
          setError('API ключ не настроен. Перейдите на вкладку "Поиск API" для настройки.');
        } else {
          setError(`Ошибка: ${err.message}`);
        }
      } else {
        setError('Произошла неизвестная ошибка');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchById(movieId);
  };

  const addToFavorites = () => {
    if (movie && onAddToFavorites) {
      const convertedMovie = kinopoiskApi.convertToAppFormat(movie, movieStaff);
      onAddToFavorites(convertedMovie);
    }
  };

  const extractIdFromUrl = (url: string): string => {
    // Извлекаем ID из различных форматов URL Кинопоиска
    const patterns = [
      /kinopoisk\.ru\/film\/(\d+)/,
      /kinopoiskapiunofficial\.tech.*?(\d+)/,
      /\/(\d+)\/?$/,
      /film\/(\d+)/,
      /id=(\d+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    // Если это просто число
    if (/^\d+$/.test(url.trim())) {
      return url.trim();
    }

    return '';
  };

  const handleInputChange = (value: string) => {
    setMovieId(value);
    
    // Автоматически извлекаем ID из URL
    if (value.includes('kinopoisk') || value.includes('film/') || value.includes('id=')) {
      const extractedId = extractIdFromUrl(value);
      if (extractedId && extractedId !== value) {
        setMovieId(extractedId);
      }
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Icon name="Hash" size={20} />
            <span>Поиск по ID Кинопоиска</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <Input
              placeholder="Введите ID фильма или ссылку с Кинопоиска..."
              value={movieId}
              onChange={(e) => handleInputChange(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !movieId.trim()}>
              {loading ? <Icon name="Loader2" size={16} className="animate-spin" /> : <Icon name="Search" size={16} />}
            </Button>
          </form>

          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Поддерживаемые форматы:</strong></p>
            <p>• ID фильма: <code>326</code></p>
            <p>• Ссылка: <code>https://www.kinopoisk.ru/film/326/</code></p>
            <p>• Прямой URL: <code>kinopoisk.ru/film/326</code></p>
          </div>
        </CardContent>
      </Card>

      {/* Ошибка */}
      {error && (
        <Alert variant="destructive">
          <Icon name="AlertCircle" className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Результат поиска */}
      {movie && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <img 
                  src={movie.posterUrl} 
                  alt={movie.nameRu || movie.nameEn || ''}
                  className="w-full max-w-sm mx-auto rounded-lg"
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
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    {movie.nameRu || movie.nameEn || movie.nameOriginal}
                  </h3>
                  {movie.nameOriginal && movie.nameOriginal !== (movie.nameRu || movie.nameEn) && (
                    <p className="text-muted-foreground text-sm">
                      {movie.nameOriginal}
                    </p>
                  )}
                </div>

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
                    onClick={addToFavorites}
                    className="flex-1"
                    disabled={favorites.includes(movie.kinopoiskId)}
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

                <div className="text-xs text-muted-foreground pt-2 border-t">
                  <p>ID на Кинопоиске: <code>{movie.kinopoiskId}</code></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}