# The News Backend

## Descrição

Este projeto é um backend para um aplicativo de notícias. Ele fornece uma API para gerenciar e obter notícias.

## Configuração do Docker

Para configurar e executar o projeto usando Docker, siga os passos abaixo:

1. Certifique-se de ter o Docker instalado em sua máquina.
2. Navegue até o diretório do projeto.
3. Execute o comando abaixo para construir a imagem Docker:

    ```sh
    docker build -t the-news-backend .
    ```

4. Após a construção da imagem, execute o comando abaixo para iniciar o contêiner:

    ```sh
    docker run -p 3000:3000 the-news-backend
    ```

## Rotas da API

Abaixo estão as rotas disponíveis na API:

### Rotas de NewsLetter

#### GET /news-letter

Retorna uma lista de todas as notícias.

##### Exemplo de resposta

```json
[
    {
        "id": "b1ec735f-7adb-41db-9402-86ba5baefe34",
        "title": "Newsletter teste1",
        "sentAt": "2025-02-23 22:24:42.058715",
        "utmCampaign": "campaign-teste-1",
        "utmSource": "site",
        "utmMedium": "site",
        "utmChannel": "site",
        "createdAt": "2025-02-23 22:24:42.058715"
    },
    // ...outras notícias
]
```

#### POST /news-letter

Cria uma nova notícia.

##### Exemplo de corpo da requisição

```json
{
    "title": "Newsletter teste5",
    "utmCampaign": "campaign-teste-3",
    "utmSource": "site",
    "utmMedium": "site",
    "utmChannel": "site"
}
```

### Rotas de Usuário

#### POST /user

Cria um novo usuário e gera um token JWT.

##### Exemplo de corpo da requisição

```json
{
    "email": "usuario@exemplo.com"
}
```

##### Exemplo de resposta

```json
{
    "user": {
        "email": "usuario@exemplo.com"
    },
    "token": "jwt_token_aqui"
}
```

#### GET /user

Retorna uma lista de todos os usuários.

##### Exemplo de resposta

```json
[
    {
        "id": "uuid_do_usuario",
        "email": "usuario@exemplo.com",
        "dayStreak": 5,
        "lastLogin": "2023-10-01T12:00:00Z"
    },
    // ...outros usuários
]
```

#### PATCH /user/promote

Promove um usuário a administrador.

##### Exemplo de corpo da requisição

```json
{
    "userEmail": "usuario@exemplo.com"
}
```

#### PATCH /user/demote

Rebaixa um administrador a usuário comum.

##### Exemplo de corpo da requisição

```json
{
    "userEmail": "usuario@exemplo.com"
}
```

#### GET /user/profile

Retorna o perfil do usuário autenticado.

##### Exemplo de resposta

```json
{
    "id": "uuid_do_usuario",
    "email": "usuario@exemplo.com",
    "dayStreak": 5,
    "lastLogin": "2023-10-01T12:00:00Z"
}
```

#### PATCH /user/profile/streak

Atualiza o streak diário do usuário.

##### Parâmetros de consulta

- `userEmail`: Email do usuário.
- `newsletterId`: ID da newsletter.

## Autenticação

### POST /auth/login

Realiza o login do usuário e retorna um token JWT.

#### Exemplo de corpo da requisição

```json
{
    "email": "usuario@exemplo.com"
}
```

#### Exemplo de resposta

```json
{
    "access_token": "jwt_token_aqui"
}
```

## ORM Drizzle

Este projeto utiliza o ORM Drizzle para interagir com o banco de dados PostgreSQL. O Drizzle fornece uma interface simples e poderosa para definir esquemas de banco de dados e realizar consultas.

### Exemplo de definição de esquema

```typescript
import {
  pgTable,
  foreignKey,
  unique,
  uuid,
  timestamp,
  varchar,
  integer,
  smallint,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable(
  'users',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    email: varchar({ length: 55 }).notNull(),
    lastLogin: timestamp('last_login', { mode: 'string' })
      .defaultNow()
      .notNull(),
    dayStreak: integer('day_streak').default(0),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    isAdmin: smallint('is_admin').default(0),
  },
  table => [unique('users_email_unique').on(table.email)],
);
```

## Contribuição

Se você deseja contribuir com este projeto, por favor, faça um fork do repositório e envie um pull request.

## Licença

Este projeto está licenciado sob a licença MIT.
