- `/api/auth/loginViaTelegram` - авторизирует пользователя, передавая в к-ве параметра JWT-токен
- `/api/user/current` - метод для получения данных текущего авторизированного пользователя
- `/api/reel` - метод для получения ленты рилсов, генерирующейся на основе портрета текущего пользователя
- `/api/reel/{id}/view` - метод для изменения статуса reels'а на "просмотрено"
- `/api/reel/{id}/like` - метод для изменения значения поля isLiked у reels'а
- `/api/files` - метод для загрузки файлов SMM-щиком
- `/api/files/{key}` - метод для получения файла
- `/api/match/find` - метод для поиска наилучшего фильма согласно портрету текущего пользователя
- `POST /api/notes` - метод для создания новой заметки используя название заметки
- `GET /api/notes` - метод для получения заметок текущего пользователя
- `/api/notes/viaFilmId` - метод для создания заметки, используя ID фильма
- `PATCH /api/notes/{id}` - метод для изменения замтеки
- `GET /api/notes/{id}` - метод для получения заметки
- `DELETE /api/notes/{id}` - метод для удаления заметки
- `/api/notes/{id}/changeState` - метод для изменения состояния заметки (просмотрено / не просмотрено)
- `/api/films/search` - метод для поиска фильмов

