# AgroControle - Web

Aplicação web (React + Vite) para controle de manutenção de máquinas agrícolas.

## Como rodar

Com o backend rodando (veja `../backend/README.md`):

```bash
cp .env.example .env
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Telas

- **/registrar** e **/entrar** — cadastro e login do produtor
- **/** — painel com as máquinas cadastradas
- **/maquinas/:id** — detalhes da máquina e histórico de manutenções (abastecimento, óleo, pneu, peças, revisão)
