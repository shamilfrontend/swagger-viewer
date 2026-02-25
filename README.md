# Swagger / OpenAPI Editor

Веб-приложение для просмотра и редактирования Swagger/OpenAPI спецификаций (YAML/JSON), аналогичное editor.swagger.io.

Demo - https://shf-swagger-viewer.netlify.app/

## Запуск

```bash
yarn
yarn dev
```

Сборка:

```bash
yarn build
yarn preview
```

## Технологии

- **Vue 3** (Composition API) + **TypeScript** + **Vite**
- **Monaco Editor** — редактор кода с подсветкой YAML/JSON и маркерами ошибок
- **Swagger UI** (swagger-ui-dist) — превью спецификации
- **splitpanes** — регулируемые панели (редактор | превью)
- **yaml** — парсинг и конвертация YAML ⇄ JSON
- **Font Awesome** — иконки в тулбаре

## Структура

- `src/components/` — Toolbar, SplitPane, Editor (Monaco), Preview (Swagger UI)
- `src/composables/` — useLocalStorage, useDebounce, useOpenApiValidator
- `src/utils/` — converters (YAML/JSON), validators
- `src/constants/defaultSpec.ts` — дефолтная OpenAPI-спецификация при первом запуске

## Основные возможности

- Загрузка файла (YAML/JSON), определение формата по расширению и содержимому
- Скачивание как YAML или JSON
- Переключение формата с конвертацией
- Сброс к дефолтной спецификации
- Полный экран
- Сохранение в localStorage (текст и формат)
- Валидация с подсветкой строки с ошибкой в редакторе и сообщением в превью
- Debounce 300 ms для превью и валидации
- Индикатор «Не сохранено» при расхождении с последней загруженной/сброшенной версией
- Drag-and-drop файла на область приложения
