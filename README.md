# Firebase Mini App

Готовое мини-приложение для наглядного понимания, как frontend подключается к Firebase Cloud Firestore.

## Что внутри

- React + Vite
- Firebase Web SDK
- Cloud Firestore
- CRUD: создание, чтение, обновление, удаление задач
- Realtime-обновления через `onSnapshot`

## 1. Установи зависимости

```bash
npm install
```

## 2. Создай проект в Firebase

1. Открой Firebase Console.
2. Создай новый проект.
3. Добавь Web App.
4. Скопируй объект `firebaseConfig`.
5. Включи Firestore Database.

## 3. Создай файл `.env`

Скопируй пример:

```bash
cp .env.example .env
```

Заполни `.env` своими значениями из Firebase:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## 4. Временно открой правила Firestore для теста

В Firebase Console → Firestore Database → Rules можно временно поставить такие правила:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if true;
    }
  }
}
```

Важно: это только для обучения и локального теста. Для реального проекта так оставлять нельзя.

## 5. Запусти приложение

```bash
npm run dev
```

Открой адрес из терминала, обычно:

```text
http://localhost:5173
```

## Где смотреть подключение к Firebase

Главный файл:

```text
src/firebase.js
```

Там происходит:

```js
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

Это и есть подключение приложения к Firestore.

## Где происходят операции с базой

Файл:

```text
src/App.jsx
```

Основные функции:

- `addDoc(...)` — добавить документ
- `onSnapshot(...)` — читать данные в реальном времени
- `updateDoc(...)` — обновить документ
- `deleteDoc(...)` — удалить документ

## Как проверить, что база реально работает

1. Запусти приложение.
2. Добавь задачу.
3. Открой Firebase Console → Firestore Database.
4. Найди коллекцию `tasks`.
5. Там появится документ с задачей.
6. Измени документ прямо в Firebase Console — приложение обновится автоматически.

## Важное про безопасность

Firebase config в frontend-приложении не является секретным паролем. Но безопасность держится на Firestore Security Rules.

Для реального приложения нужно добавить Firebase Authentication и правила вроде: пользователь может читать и менять только свои документы.
