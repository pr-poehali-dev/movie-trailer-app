import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import MovieSearchApi from '@/components/MovieSearchApi';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [myLists, setMyLists] = useState(['Посмотреть позже', 'Любимые фильмы']);
  const [newListName, setNewListName] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('Все');
  const [yearRange, setYearRange] = useState([1990, 2024]);
  const [minRating, setMinRating] = useState([0]);

  const genres = [
    'Боевики', 'Комедии', 'Драмы', 'Ужасы', 'Фантастика', 
    'Триллеры', 'Документальные', 'Мультфильмы', 'Романтические'
  ];

  const featuredMovie = {
    title: 'Интерстеллар',
    description: 'Команда исследователей путешествует через червоточину в космосе в попытке обеспечить выживание человечества.',
    duration: '2ч 49мин',
    year: '2014',
    genre: 'Научная фантастика',
    rating: 8.6
  };

  const moviesData = [
    { 
      id: 1, 
      title: 'Начало', 
      year: 2010, 
      genre: 'Фантастика', 
      rating: 8.8, 
      image: '/img/87892f4c-a1a6-4703-a9d4-b12fdadadb30.jpg',
      duration: '2ч 28мин',
      director: 'Кристофер Нолан',
      cast: ['Леонардо ДиКаприо', 'Марион Котийяр', 'Том Харди'],
      plot: 'Дом Кобб — талантливый вор, лучший из лучших в опасном искусстве извлечения: он крадет секреты из подсознания людей, когда их разум наиболее уязвим — во время сна.',
      trailer: 'https://youtube.com/watch?v=trailer1'
    },
    { 
      id: 2, 
      title: 'Темный рыцарь', 
      year: 2008, 
      genre: 'Боевик', 
      rating: 9.0, 
      image: '/img/87892f4c-a1a6-4703-a9d4-b12fdadadb30.jpg',
      duration: '2ч 32мин',
      director: 'Кристофер Нолан',
      cast: ['Кристиан Бэйл', 'Хит Леджер', 'Аарон Экхарт'],
      plot: 'Бэтмен поднимает ставки в войне с криминалом. С помощью лейтенанта Джима Гордона и прокурора Харви Дента он намерен очистить улицы от преступности.',
      trailer: 'https://youtube.com/watch?v=trailer2'
    },
    { 
      id: 3, 
      title: 'Матрица', 
      year: 1999, 
      genre: 'Фантастика', 
      rating: 8.7, 
      image: '/img/87892f4c-a1a6-4703-a9d4-b12fdadadb30.jpg',
      duration: '2ч 16мин',
      director: 'Вачовски',
      cast: ['Киану Ривз', 'Лоренс Фишберн', 'Кэрри-Энн Мосс'],
      plot: 'Хакер Нео узнает от таинственных незнакомцев о том, что мир, в котором он живет, — иллюзия. Реальность намного мрачнее и опаснее.',
      trailer: 'https://youtube.com/watch?v=trailer3'
    },
    { 
      id: 4, 
      title: 'Криминальное чтиво', 
      year: 1994, 
      genre: 'Криминал', 
      rating: 8.9, 
      image: '/img/87892f4c-a1a6-4703-a9d4-b12fdadadb30.jpg',
      duration: '2ч 34мин',
      director: 'Квентин Тарантино',
      cast: ['Джон Траволта', 'Сэмюэл Л. Джексон', 'Ума Турман'],
      plot: 'Два наемных убийцы, жена гангстера, боксер и пара грабителей оказываются в четырех переплетающихся историях насилия и искупления.',
      trailer: 'https://youtube.com/watch?v=trailer4'
    },
    { 
      id: 5, 
      title: 'Форрест Гамп', 
      year: 1994, 
      genre: 'Драма', 
      rating: 8.8, 
      image: '/img/87892f4c-a1a6-4703-a9d4-b12fdadadb30.jpg',
      duration: '2ч 22мин',
      director: 'Роберт Земекис',
      cast: ['Том Хэнкс', 'Робин Райт', 'Гэри Синиз'],
      plot: 'История жизни Форреста Гампа, простодушного человека из Алабамы, который становится свидетелем важнейших событий американской истории.',
      trailer: 'https://youtube.com/watch?v=trailer5'
    },
    { 
      id: 6, 
      title: 'Гладиатор', 
      year: 2000, 
      genre: 'Драма', 
      rating: 8.5, 
      image: '/img/87892f4c-a1a6-4703-a9d4-b12fdadadb30.jpg',
      duration: '2ч 35мин',
      director: 'Ридли Скотт',
      cast: ['Рассел Кроу', 'Хоакин Феникс', 'Конни Нильсен'],
      plot: 'Римский полководец Максимус становится рабом-гладиатором после предательства императора Коммода, который убил его семью.',
      trailer: 'https://youtube.com/watch?v=trailer6'
    },
  ];

  // Фильтрация фильмов
  const filteredMovies = moviesData.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'Все' || movie.genre === selectedGenre;
    const matchesYear = movie.year >= yearRange[0] && movie.year <= yearRange[1];
    const matchesRating = movie.rating >= minRating[0];
    return matchesSearch && matchesGenre && matchesYear && matchesRating;
  });

  const movies = filteredMovies;

  const recommendations = movies.slice(0, 4);
  const popular = movies.slice(2, 6);

  const addNewList = () => {
    if (newListName.trim()) {
      setMyLists([...myLists, newListName.trim()]);
      setNewListName('');
    }
  };

  const toggleFavorite = (movieId: number) => {
    setFavorites(prev => 
      prev.includes(movieId) 
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId]
    );
  };

  const resetFilters = () => {
    setSelectedGenre('Все');
    setYearRange([1990, 2024]);
    setMinRating([0]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-primary">CinemaFlix</h1>
              <div className="hidden md:flex space-x-6">
                <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
                  Главная
                </Button>
                <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
                  Фильмы
                </Button>
                <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
                  Сериалы
                </Button>
                <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
                  Мой список
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Поиск фильмов и сериалов..."
                  className="pl-10 w-64 bg-muted"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Filters Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Icon name="Filter" size={20} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Фильтры</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Жанр</label>
                      <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите жанр" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Все">Все</SelectItem>
                          <SelectItem value="Фантастика">Фантастика</SelectItem>
                          <SelectItem value="Боевик">Боевик</SelectItem>
                          <SelectItem value="Драма">Драма</SelectItem>
                          <SelectItem value="Криминал">Криминал</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Год выпуска: {yearRange[0]} - {yearRange[1]}</label>
                      <Slider
                        value={yearRange}
                        onValueChange={setYearRange}
                        min={1990}
                        max={2024}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Минимальный рейтинг: {minRating[0]}</label>
                      <Slider
                        value={minRating}
                        onValueChange={setMinRating}
                        min={0}
                        max={10}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={resetFilters}>
                        Сбросить
                      </Button>
                      <div className="text-sm text-muted-foreground">
                        Найдено: {filteredMovies.length} фильмов
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button variant="ghost" size="icon">
                <Icon name="Bell" size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="User" size={20} />
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/img/f9e80d35-a919-499b-a1de-3edc3a0bea3b.jpg')`
          }}
        />
        
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-lg animate-slide-up">
            <h2 className="text-5xl font-bold mb-4">{featuredMovie.title}</h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {featuredMovie.description}
            </p>
            
            <div className="flex items-center space-x-4 mb-6">
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                <Icon name="Star" size={14} className="mr-1" />
                {featuredMovie.rating}
              </Badge>
              <span className="text-muted-foreground">{featuredMovie.year}</span>
              <span className="text-muted-foreground">{featuredMovie.duration}</span>
              <Badge variant="outline">{featuredMovie.genre}</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Icon name="Play" size={20} className="mr-2" />
                Воспроизвести
              </Button>
              <Button size="lg" variant="outline">
                <Icon name="Plus" size={20} className="mr-2" />
                В мой список
              </Button>
              <Button size="lg" variant="ghost">
                <Icon name="Info" size={20} className="mr-2" />
                Подробнее
              </Button>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8 space-y-12">
        
        {/* Movie Sections */}
        <section className="space-y-8">
          
          {/* Recommendations */}
          <div className="animate-fade-in">
            <h3 className="text-2xl font-semibold mb-6">Рекомендуем посмотреть</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recommendations.map((movie) => (
                <Dialog key={movie.id}>
                  <DialogTrigger asChild>
                    <Card className="group cursor-pointer hover:scale-105 transition-all duration-300 bg-card border-border">
                      <CardContent className="p-0">
                        <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
                          <img 
                            src={movie.image} 
                            alt={movie.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex space-x-2">
                              <Button size="sm" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                                <Icon name="Play" size={14} />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(movie.id);
                                }}
                              >
                                <Icon name={favorites.includes(movie.id) ? "Heart" : "Plus"} size={14} />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-sm mb-2 truncate">{movie.title}</h4>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{movie.year}</span>
                            <div className="flex items-center">
                              <Icon name="Star" size={12} className="mr-1 text-accent" />
                              {movie.rating}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">{movie.title}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <img 
                          src={movie.image} 
                          alt={movie.title}
                          className="w-full rounded-lg"
                        />
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">
                            <Icon name="Star" size={14} className="mr-1" />
                            {movie.rating}
                          </Badge>
                          <Badge variant="outline">{movie.year}</Badge>
                          <Badge variant="outline">{movie.duration}</Badge>
                          <Badge>{movie.genre}</Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Описание</h4>
                          <p className="text-muted-foreground text-sm leading-relaxed">{movie.plot}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Режиссер</h4>
                          <p className="text-sm">{movie.director}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">В ролях</h4>
                          <p className="text-sm text-muted-foreground">{movie.cast.join(', ')}</p>
                        </div>
                        
                        <div className="flex space-x-3 pt-4">
                          <Button className="flex-1">
                            <Icon name="Play" size={16} className="mr-2" />
                            Смотреть
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => toggleFavorite(movie.id)}
                            className="flex-1"
                          >
                            <Icon name={favorites.includes(movie.id) ? "Heart" : "Plus"} size={16} className="mr-2" />
                            {favorites.includes(movie.id) ? "Убрать" : "В избранное"}
                          </Button>
                        </div>
                        
                        <Button variant="outline" className="w-full">
                          <Icon name="ExternalLink" size={16} className="mr-2" />
                          Смотреть трейлер
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>

          {/* Popular */}
          <div className="animate-fade-in">
            <h3 className="text-2xl font-semibold mb-6">Популярное сейчас</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popular.map((movie) => (
                <Dialog key={movie.id}>
                  <DialogTrigger asChild>
                    <Card className="group cursor-pointer hover:scale-105 transition-all duration-300 bg-card border-border">
                      <CardContent className="p-0">
                        <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
                          <img 
                            src={movie.image} 
                            alt={movie.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex space-x-2">
                              <Button size="sm" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                                <Icon name="Play" size={14} />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(movie.id);
                                }}
                              >
                                <Icon name={favorites.includes(movie.id) ? "Heart" : "Plus"} size={14} />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-sm mb-2 truncate">{movie.title}</h4>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{movie.year}</span>
                            <div className="flex items-center">
                              <Icon name="Star" size={12} className="mr-1 text-accent" />
                              {movie.rating}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">{movie.title}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <img 
                          src={movie.image} 
                          alt={movie.title}
                          className="w-full rounded-lg"
                        />
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">
                            <Icon name="Star" size={14} className="mr-1" />
                            {movie.rating}
                          </Badge>
                          <Badge variant="outline">{movie.year}</Badge>
                          <Badge variant="outline">{movie.duration}</Badge>
                          <Badge>{movie.genre}</Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Описание</h4>
                          <p className="text-muted-foreground text-sm leading-relaxed">{movie.plot}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Режиссер</h4>
                          <p className="text-sm">{movie.director}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">В ролях</h4>
                          <p className="text-sm text-muted-foreground">{movie.cast.join(', ')}</p>
                        </div>
                        
                        <div className="flex space-x-3 pt-4">
                          <Button className="flex-1">
                            <Icon name="Play" size={16} className="mr-2" />
                            Смотреть
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => toggleFavorite(movie.id)}
                            className="flex-1"
                          >
                            <Icon name={favorites.includes(movie.id) ? "Heart" : "Plus"} size={16} className="mr-2" />
                            {favorites.includes(movie.id) ? "Убрать" : "В избранное"}
                          </Button>
                        </div>
                        
                        <Button variant="outline" className="w-full">
                          <Icon name="ExternalLink" size={16} className="mr-2" />
                          Смотреть трейлер
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="animate-fade-in">
          <Tabs defaultValue="genres" className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl">
              <TabsTrigger value="search">Поиск API</TabsTrigger>
              <TabsTrigger value="genres">Жанры</TabsTrigger>
              <TabsTrigger value="favorites">Избранное</TabsTrigger>
              <TabsTrigger value="lists">Мои списки</TabsTrigger>
            </TabsList>
            
            <TabsContent value="search" className="mt-6">
              <MovieSearchApi 
                onAddToFavorites={(movie) => {
                  if (!favorites.includes(movie.id)) {
                    setFavorites([...favorites, movie.id]);
                  }
                }}
                favorites={favorites}
              />
            </TabsContent>
            
            <TabsContent value="genres" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Выберите жанр</h3>
                <div className="flex flex-wrap gap-3">
                  {genres.map((genre) => (
                    <Badge 
                      key={genre} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors px-4 py-2 text-sm"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="favorites" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Избранные фильмы ({favorites.length})</h3>
                {favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="Heart" size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Пока нет избранных фильмов</p>
                    <p className="text-sm text-muted-foreground">Добавьте фильмы в избранное, нажимая ❤️</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {moviesData.filter(movie => favorites.includes(movie.id)).map((movie) => (
                      <Dialog key={movie.id}>
                        <DialogTrigger asChild>
                          <Card className="group cursor-pointer hover:scale-105 transition-all duration-300 bg-card border-border">
                            <CardContent className="p-0">
                              <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
                                <img 
                                  src={movie.image} 
                                  alt={movie.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute top-2 right-2">
                                  <Button 
                                    size="sm" 
                                    variant="secondary" 
                                    className="h-8 w-8 p-0 bg-primary/20 hover:bg-primary/30" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleFavorite(movie.id);
                                    }}
                                  >
                                    <Icon name="Heart" size={14} className="text-primary" />
                                  </Button>
                                </div>
                              </div>
                              <div className="p-4">
                                <h4 className="font-semibold text-sm mb-2 truncate">{movie.title}</h4>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span>{movie.year}</span>
                                  <div className="flex items-center">
                                    <Icon name="Star" size={12} className="mr-1 text-accent" />
                                    {movie.rating}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-2xl">{movie.title}</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <img 
                                src={movie.image} 
                                alt={movie.title}
                                className="w-full rounded-lg"
                              />
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">
                                  <Icon name="Star" size={14} className="mr-1" />
                                  {movie.rating}
                                </Badge>
                                <Badge variant="outline">{movie.year}</Badge>
                                <Badge variant="outline">{movie.duration}</Badge>
                                <Badge>{movie.genre}</Badge>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2">Описание</h4>
                                <p className="text-muted-foreground text-sm leading-relaxed">{movie.plot}</p>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold mb-2">Режиссер</h4>
                                <p className="text-sm">{movie.director}</p>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold mb-2">В ролях</h4>
                                <p className="text-sm text-muted-foreground">{movie.cast.join(', ')}</p>
                              </div>
                              
                              <div className="flex space-x-3 pt-4">
                                <Button className="flex-1">
                                  <Icon name="Play" size={16} className="mr-2" />
                                  Смотреть
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={() => toggleFavorite(movie.id)}
                                  className="flex-1"
                                >
                                  <Icon name="Heart" size={16} className="mr-2" />
                                  Убрать из избранного
                                </Button>
                              </div>
                              
                              <Button variant="outline" className="w-full">
                                <Icon name="ExternalLink" size={16} className="mr-2" />
                                Смотреть трейлер
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="lists" className="mt-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Создать новый список</h3>
                  <div className="flex gap-3 max-w-md">
                    <Input 
                      placeholder="Название списка..."
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addNewList()}
                    />
                    <Button onClick={addNewList} disabled={!newListName.trim()}>
                      <Icon name="Plus" size={16} className="mr-2" />
                      Создать
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Ваши списки</h3>
                  <div className="grid gap-3">
                    {myLists.map((list, index) => (
                      <Card key={index} className="group cursor-pointer hover:bg-accent/10 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Icon name="List" size={18} className="text-muted-foreground" />
                              <span className="font-medium">{list}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary">0 фильмов</Badge>
                              <Button variant="ghost" size="sm">
                                <Icon name="ArrowRight" size={16} />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
};

export default Index;