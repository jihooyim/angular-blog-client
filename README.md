# Blog Client

This is a modern web application developed using the latest version of **Angular**. Inspired by the **Blogger** platform, this project was built in collaboration with **ChatGPT** and includes a **Spring Boot** backend.

## 🌐 Features

- Frontend built with Angular 20+
- Backend powered by Spring Boot
- Blog-style layout and content editing
- Real-time features via WebSocket (StompJS)
- Markdown support with syntax highlighting
- Modular architecture using Angular Material and AG-Grid
- Editor powered by ngx-editor

## 🛠️ Local Development

To run the project locally:

```bash
npm install
ng serve
```

Open your browser and navigate to:  
[http://localhost:4200](http://localhost:4200)

## 🚀 Production Build & Deployment

To create a production build and serve it with **nginx**:

```bash
ng build --configuration production
```

Then deploy the contents of the `dist/` directory to your nginx web root. After deploying:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 📦 Scripts

Below are the key `npm` scripts configured in the project:

| Command         | Description                    |
| --------------- | ------------------------------ |
| `npm start`     | Runs `ng serve` (development)  |
| `npm run build` | Builds the app                 |
| `npm run watch` | Builds and watches for changes |
| `npm test`      | Runs unit tests                |

## 🧩 Tech Stack

- **Frontend**: Angular 20, Angular Material, AG-Grid, ngx-editor, FullCalendar
- **Backend**: Spring Boot
- **Styles**: Bootstrap 5, Bootstrap Icons
- **Utils**: ExcelJS, FileSaver, D3.js, Highlight.js, Marked, etc.

## 📁 Folder Structure

> You can find the complete source code inside the `/src` directory.

## 🤖 Collaborators

This project was developed in collaboration with **ChatGPT**, leveraging AI-powered suggestions and code generation for enhanced productivity and quality.

## environment Examples.

### src\environments\environment.development.ts

```
export const environment = {
  production: false,
  apiBase: '/api',
  wsBase: '/ws',
};
```

### src\environments\environment.ts

```
export const environment = {
  production: false,
  apiBase: 'http://localhost:8080/api',
  wsBase: 'http://localhost:8080/ws',
};
```

### src\environments\environment.production.ts

```
export const environment = {
  production: true,
  apiBase: 'https://your site /api',
  wsBase: 'https://your site /ws',
};

```
