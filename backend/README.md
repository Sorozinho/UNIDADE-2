# AgroControle - Backend

API REST para o controle de manutenção de máquinas e veículos agrícolas.

## Stack

- Node.js + Express
- PostgreSQL + Sequelize
- Autenticação via JWT

## Como rodar

### 1. Subir o banco de dados

Com Docker:

```bash
docker compose up -d
```

Ou use um PostgreSQL já instalado localmente — nesse caso, crie um banco chamado `agrocontrole`.

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Ajuste os dados de conexão em `.env` se necessário.

### 3. Instalar dependências

```bash
npm install
```

### 4. Criar as tabelas

```bash
npm run db:migrate
```

### 5. Rodar o servidor

```bash
npm run dev
```

O servidor sobe em `http://localhost:3000` (ou na porta definida em `PORT`).

## Endpoints

### Autenticação

| Método | Rota           | Descrição                          | Autenticado |
|--------|----------------|-------------------------------------|:-----------:|
| POST   | `/auth/register` | Cria uma conta de produtor        | Não |
| POST   | `/auth/login`     | Login, retorna token JWT          | Não |
| GET    | `/auth/me`        | Dados do usuário logado           | Sim |

`POST /auth/register`
```json
{
  "name": "João da Silva",
  "email": "joao@exemplo.com",
  "password": "senha123",
  "propertyName": "Sítio Boa Vista",
  "city": "Tangará/SC"
}
```

Respostas de autenticação (register/login) retornam `{ user, token }`. Envie o token nas próximas requisições:

```
Authorization: Bearer <token>
```

### Máquinas / veículos

| Método | Rota             | Descrição                    |
|--------|------------------|-------------------------------|
| GET    | `/machines`        | Lista as máquinas do usuário |
| POST   | `/machines`        | Cadastra uma máquina         |
| GET    | `/machines/:id`     | Detalhe + histórico de manutenções |
| PUT    | `/machines/:id`     | Atualiza uma máquina         |
| DELETE | `/machines/:id`     | Remove uma máquina           |

`POST /machines`
```json
{
  "name": "Trator Massey Ferguson 275",
  "type": "trator",
  "brand": "Massey Ferguson",
  "model": "275",
  "year": 2015,
  "identifier": "TRT-01",
  "currentHours": 3200,
  "notes": "Uso geral na lavoura"
}
```

`type` aceita: `trator`, `colheitadeira`, `pulverizador`, `caminhao`, `implemento`, `outro`.

### Manutenções

| Método | Rota                                       | Descrição                    |
|--------|---------------------------------------------|--------------------------------|
| GET    | `/machines/:machineId/maintenances`        | Lista manutenções da máquina |
| POST   | `/machines/:machineId/maintenances`        | Registra uma manutenção      |
| PUT    | `/machines/:machineId/maintenances/:id`    | Atualiza um registro         |
| DELETE | `/machines/:machineId/maintenances/:id`    | Remove um registro           |

`POST /machines/:machineId/maintenances`
```json
{
  "type": "troca_oleo",
  "date": "2026-08-20",
  "hoursOrKm": 3250,
  "description": "Troca de óleo do motor 15W40",
  "cost": 180.5,
  "notes": "Filtro também trocado"
}
```

`type` aceita: `abastecimento`, `troca_oleo`, `troca_pneu`, `troca_peca`, `revisao`, `outro`.
