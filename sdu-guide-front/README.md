# Проект SDU Frontend

Здравствуйте! Вы открыли проектную работу по SDU, а именно его Frontend часть.

## Установка необходимых зависимостей

Перед началом работы установите Node.js, если он еще не установлен. Для этого используйте команду в терминале IntelliJ IDEA:
```
sudo apt install nodejs # для Linux
winget install OpenJS.NodeJS # для Windows
brew install node # для macOS
```

### Установка React

Создавать проект на React не требуется, так как он уже настроен. Однако, если необходимо, установите React:
```
npm install react
```

### Установка дополнительных библиотек

#### XLSX (для работы с Excel файлами)
```
npm install xlsx
```

Для работы проекта необходимо установить следующие библиотеки:

#### Lucide React
```
npm install lucide-react
```

#### React Icons (FontAwesome)
```
npm install react-icons
```

#### React Router DOM (для маршрутизации)
```
npm install react-router-dom
```

#### Axios (для работы с HTTP-запросами)
```
npm install axios
```

### Установка devDependencies

Для работы со стилями и сборкой проекта установите следующие зависимости:
```
npm install --save-dev autoprefixer@10.4.20 postcss@8.5.3 tailwindcss@3.4.1
```

## Структура проекта

Проект состоит из следующих страниц и компонентов:

- **Homepage** – Главная страница (HomePage.js)
- **How To** – Страница "Как" (HowToPage.js)
- **Navbar** – Навигационная панель (Navbar.js)
- **Footer** – Нижняя навигационная панель (Footer.js)
- **App.js** – Файл, который подключает все страницы
- **Все изображения** находятся в папке: `src/components/assets`

## Запуск проекта

### Доступ к админ-панели

В проекте реализована админ-панель, доступ к которой можно получить по адресу:
```
http://localhost:3000/admin
```

При первом переходе потребуется ввести логин и пароль:
- **Логин:** admin
- **Пароль:** password


Для запуска проекта используйте команду:
```
npm start
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере, чтобы увидеть приложение в действии.
