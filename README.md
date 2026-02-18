# Papo de Quadrilha

Projeto web em React + Vite com Firebase (Auth + Firestore), pronto para deploy no Vercel.

## Funcionalidades

- Login com email/senha e Google.
- Perfil de usuario editavel (cada usuario edita apenas o proprio perfil).
- Publicacao de anuncios por usuarios.
- Moderacao de anuncios por admin.
- Publicacao de noticias por admin.
- Feed da Home com os 3 posts mais recentes do Instagram via rota serverless no Vercel.

## Stack

- React 19
- Vite 7
- React Router DOM
- Firebase Auth
- Cloud Firestore
- Vercel Functions (`api/instagram.js`)

## 1) Configuracao Firebase

1. Crie um projeto no Firebase.
2. Ative Authentication:
   - Email/Senha
   - Google
3. Crie o Cloud Firestore.
4. Crie um App Web e copie as credenciais.

## 2) Variaveis de ambiente

Copie `.env.example` para `.env` e preencha.

### Frontend (Vite)

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Opcional:

```bash
VITE_INSTAGRAM_API_URL=
```

Se vazio, o frontend usa `/api/instagram?limit=3`.

### Backend (Vercel Functions)

Defina no painel da Vercel (Project Settings > Environment Variables):

```bash
INSTAGRAM_USER_ID=...
INSTAGRAM_ACCESS_TOKEN=...
INSTAGRAM_API_VERSION=v24.0
```

## 3) Instagram real na Home (3 posts)

O endpoint `api/instagram.js`:

- recebe `GET /api/instagram?limit=3`
- busca posts na Instagram Graph API no backend
- retorna dados normalizados para o frontend
- usa cache (`s-maxage=300`)

Se a API falhar, a Home mostra cards de fallback e nao quebra a pagina.

## 4) Rodar localmente

```bash
npm install
npm run dev
```

Observacao: ao rodar apenas `npm run dev` (Vite), a rota `/api/instagram` nao existe localmente.
Para testar feed real local, use `vercel dev` ou configure `VITE_INSTAGRAM_API_URL` para uma URL publicada.

## 5) Definir primeiro admin

Depois de criar um usuario, altere no Firestore:

- `users/{uid}.role = "admin"`

## 6) Regras e indices Firestore

Arquivos no projeto:

- `firebase/firestore.rules`
- `firebase/firestore.indexes.json`
