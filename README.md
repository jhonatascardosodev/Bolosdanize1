# Bolos da Nize

Site da confeitaria **Bolos da Nize** (Itacoatiara - AM) com cardápio online, carrinho e área administrativa.

## Stack

| Camada | Tecnologias |
|--------|-------------|
| Frontend | Vue 3, Vite, Vuetify, Tailwind, Pinia, Vue Router |
| Backend | Express, SQLite (`node:sqlite`), JWT, Multer, Swagger |
| Deploy | Vercel (frontend), Docker (API) |

## Instalação

```bash
# Instalar tudo (frontend + backend)
pnpm install:all

# Copiar variáveis de ambiente
cp .env.example .env
```

## Desenvolvimento

```bash
# API + site juntos
pnpm dev:all

# Ou separado:
pnpm dev:server   # API em http://localhost:3001
pnpm dev          # Site em http://localhost:5173
```

- **Admin:** `/admin/login` (senha padrão dev: `admin123`)
- **Swagger:** http://localhost:3001/api-docs
- **Health check:** http://localhost:3001/api/health

## Scripts de manutenção

| Comando | Descrição |
|---------|-----------|
| `pnpm lint` | Verifica erros de código (ESLint) |
| `pnpm format` | Formata arquivos (Prettier) |
| `pnpm format:check` | Só verifica formatação |
| `pnpm test` | Testes do backend |
| `pnpm check` | Testes + build de produção |
| `pnpm build` | Build do frontend |

## Estrutura do projeto

```
Bolosdanize1/
├── src/                    # Frontend Vue
│   ├── components/         # Seções e UI reutilizável
│   ├── pages/              # Rotas (Home, Cardápio, Admin...)
│   ├── stores/             # Estado Pinia (cart, products, auth)
│   ├── services/api.js     # Cliente HTTP da API
│   ├── constants/          # Chaves e valores compartilhados
│   └── utils/              # WhatsApp, SEO, etc.
├── server/                 # Backend Express
│   ├── routes/             # Rotas por domínio (auth, products, health)
│   ├── middleware/         # Auth, segurança, erros, rate limit
│   ├── lib/                # Upload, validação, arquivos
│   ├── test/               # Testes automatizados
│   ├── db.js               # SQLite e queries
│   ├── app.js              # Montagem do Express
│   └── index.js            # Entrada do servidor
├── scripts/dev-all.js      # Sobe API + frontend
└── .env.example            # Variáveis documentadas
```

## Onde alterar cada coisa

| Precisa mudar... | Arquivo |
|------------------|---------|
| Produtos do cardápio | Admin `/admin` ou API `/api/products` |
| Número do WhatsApp | `.env` → `VITE_WHATSAPP_NUMBER` |
| Senha do admin | `.env` → `ADMIN_PASSWORD` |
| Cores e tipografia | `src/style.css`, `src/plugins/vuetify.js` |
| Rotas do site | `src/router/index.js` |
| Regras da API | `server/routes/` e `server/lib/validators.js` |
| Segurança (CORS, rate limit) | `server/config.js`, `server/middleware/` |

## Variáveis de ambiente

Veja `.env.example` para a lista completa. Em produção, defina obrigatoriamente:

- `JWT_SECRET` (mín. 32 caracteres)
- `ADMIN_PASSWORD` (mín. 8 caracteres)
- `CORS_ORIGINS` (URL do site)
- `NODE_ENV=production`

## Testes

```bash
pnpm test
```

Cobrem validação de produtos e health check da API. Antes de deploy:

```bash
pnpm check
```

## Contato

- **WhatsApp:** (92) 99198-5973
- **Instagram:** [@bolosdanizeoficial](https://www.instagram.com/bolosdanizeoficial)

---

*Bolos da Nize — Confeitaria Artesanal*
