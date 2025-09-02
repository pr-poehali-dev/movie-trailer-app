import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [myLists, setMyLists] = useState(['Посмотреть позже', 'Любимые фильмы']);
  const [newListName, setNewListName] = useState('');

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

  const movies = [
    { id: 1, title: 'Начало', year: '2010', genre: 'Фантастика', rating: 8.8, image: '/img/87892f4c-a1a6-4703-a9d4-b12fdadadb30.jpg' },
    { id: 2, title: 'Темный рыцарь', year: '2008', genre: 'Боевик', rating: 9.0, image: '/img/87892f4c-a1a6-4703-a9d4-b12fdadadb30.jpg' },
    { id: 3, title: 'Матрица', year: '1999', genre: 'Фантастика', rating: 8.7, image: '/img/87892f4c-a1a6-4703-a9d4-b12fdadadb30.jpg' },
    { id: 4, title: 'Криминальное чтиво', year: '1994', genre: 'Криминал', rating: 8.9, image: '/img/87892f4c-a1a6-4703-a9d4-b12fdadadb30.jpg' },
    { id: 5, title: 'Форрест Гамп', year: '1994', genre: 'Драма', rating: 8.8, image: '/img/87892f4c-a1a6-4703-a9d4-b12fdadadb30.jpg' },
    { id: 6, title: 'Гладиатор', year: '2000', genre: 'Драма', rating: 8.5, image: '/img/87892f4c-a1a6-4703-a9d4-b12fdadadb30.jpg' },
  ];

  const recommendations = movies.slice(0, 4);
  const popular = movies.slice(2, 6);

  const addNewList = () => {
    if (newListName.trim()) {
      setMyLists([...myLists, newListName.trim()]);
      setNewListName('');
    }
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
                <Card key={movie.id} className="group cursor-pointer hover:scale-105 transition-all duration-300 bg-card border-border">
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
                          <Button size="sm" className="h-8 w-8 p-0">
                            <Icon name="Play" size={14} />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Icon name="Plus" size={14} />
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
              ))}
            </div>
          </div>

          {/* Popular */}
          <div className="animate-fade-in">
            <h3 className="text-2xl font-semibold mb-6">Популярное сейчас</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popular.map((movie) => (
                <Card key={movie.id} className="group cursor-pointer hover:scale-105 transition-all duration-300 bg-card border-border">
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
                          <Button size="sm" className="h-8 w-8 p-0">
                            <Icon name="Play" size={14} />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Icon name="Plus" size={14} />
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
              ))}
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="animate-fade-in">
          <Tabs defaultValue="genres" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="genres">Жанры</TabsTrigger>
              <TabsTrigger value="lists">Мои списки</TabsTrigger>
            </TabsList>
            
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