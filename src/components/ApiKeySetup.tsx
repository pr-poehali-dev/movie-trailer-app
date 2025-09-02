import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';

interface ApiKeySetupProps {
  onApiKeySet?: (apiKey: string) => void;
}

export default function ApiKeySetup({ onApiKeySet }: ApiKeySetupProps) {
  const [apiKey, setApiKey] = useState('');
  const [savedApiKey, setSavedApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('kinopoisk-api-key');
    if (stored) {
      setSavedApiKey(stored);
      if (onApiKeySet) {
        onApiKeySet(stored);
      }
    }
  }, [onApiKeySet]);

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('kinopoisk-api-key', apiKey.trim());
      setSavedApiKey(apiKey.trim());
      setApiKey('');
      if (onApiKeySet) {
        onApiKeySet(apiKey.trim());
      }
    }
  };

  const clearApiKey = () => {
    localStorage.removeItem('kinopoisk-api-key');
    setSavedApiKey('');
    if (onApiKeySet) {
      onApiKeySet('');
    }
  };

  const maskedKey = (key: string) => {
    if (!key) return '';
    return key.slice(0, 8) + '••••••••' + key.slice(-4);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icon name="Key" size={20} />
          <span>API ключ Кинопоиска</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {savedApiKey ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} className="text-green-600" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  API ключ настроен
                </span>
              </div>
              <Badge variant="secondary">Активен</Badge>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Текущий ключ:</label>
              <div className="flex items-center space-x-2">
                <code className="flex-1 p-2 bg-muted rounded text-sm">
                  {showKey ? savedApiKey : maskedKey(savedApiKey)}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowKey(!showKey)}
                >
                  <Icon name={showKey ? "EyeOff" : "Eye"} size={14} />
                </Button>
              </div>
            </div>
            
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={clearApiKey}
              className="w-full"
            >
              <Icon name="Trash2" size={14} className="mr-2" />
              Удалить ключ
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert>
              <Icon name="Info" className="h-4 w-4" />
              <AlertDescription>
                Для поиска фильмов через API Кинопоиска необходим ключ доступа.
                Получите его на{' '}
                <a 
                  href="https://kinopoiskapiunofficial.tech/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  kinopoiskapiunofficial.tech
                </a>
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">API ключ:</label>
              <div className="flex space-x-2">
                <Input
                  type="password"
                  placeholder="Введите ваш API ключ..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && saveApiKey()}
                />
                <Button onClick={saveApiKey} disabled={!apiKey.trim()}>
                  <Icon name="Save" size={16} />
                </Button>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Ключ сохраняется локально в вашем браузере</p>
              <p>• Используется только для запросов к API Кинопоиска</p>
              <p>• Можно удалить в любое время</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}