# Papo de Quadrilha

Projeto web em React + Vite com Firebase (Auth + Firestore), pronto para deploy no Vercel.

## Funcionalidades

- Login com email/senha e Google.
- Perfil de usuario editavel (cada usuario edita apenas o proprio perfil).
- Publicacao de anuncios por usuarios.
- Moderacao de anuncios por admin.
- Publicacao de noticias por admin.

## Stack

- React 19
- Vite 7
- React Router DOM
- Firebase Auth
- Cloud Firestore

## 1) Configuracao Firebase

1. Crie um projeto no Firebase.
2. Ative Authentication:
   - Email/Senha
   - Google
3. Crie o Cloud Firestore.
4. Crie um App Web e copie as credenciais.

## 2) Variaveis de ambiente

Copie `.env.example` para `.env` e preencha:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## 3) Rodar localmente

```bash
npm install
npm run dev
```

## 4) Definir primeiro admin

Depois de criar um usuario, altere no Firestore:

- `users/{uid}.role = "admin"`

## 5) Regras e indices Firestore

Arquivos no projeto:

- `firebase/firestore.rules`
- `firebase/firestore.indexes.json`
