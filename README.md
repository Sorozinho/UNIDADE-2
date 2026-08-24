# AgroControle 🚜

Projeto acadêmico: aplicativo para controle de manutenção de máquinas e veículos agrícolas, voltado para pequenos produtores rurais.

## Sobre o projeto

Muitos agricultores ainda controlam gastos, manutenções e atividades da propriedade em cadernos, anotações soltas ou de memória, o que dificulta o acompanhamento dos resultados. O AgroControle propõe uma ferramenta simples e acessível para registrar, para cada máquina ou veículo, quando foi feito o abastecimento, a troca de óleo, a troca de pneus, peças e outras manutenções — com data, horímetro/hodômetro e custo.

O projeto tem viés comunitário: a ideia original do grupo prevê, em uma etapa futura, um mural para os produtores compartilharem avisos entre si (empréstimo de equipamentos, produtos disponíveis, reuniões da associação, etc.), fortalecendo a cooperação na comunidade rural. Esse MVP entrega o núcleo do sistema — o controle de máquinas — como base para essa evolução.

## Arquitetura

Um único backend (API REST) é consumido por dois clientes, web e mobile:

```
UNIDADE-2/
├── backend/   Node.js + Express + PostgreSQL (API REST, autenticação JWT)
├── web/       React + Vite (aplicação web responsiva)
└── mobile/    Expo + React Native (aplicativo Android/iOS)
```

### Modelo de dados

- **Usuário (produtor)**: nome, email, senha, propriedade, cidade
- **Máquina/veículo**: nome, tipo (trator, colheitadeira, pulverizador, caminhão, implemento, outro), marca, modelo, ano, identificação, horas/km atuais
- **Manutenção**: tipo (abastecimento, troca de óleo, troca de pneu, troca de peça, revisão, outro), data, horas/km no momento, descrição, custo, observações

Cada manutenção pertence a uma máquina, e cada máquina pertence a um usuário — os dados de cada produtor ficam isolados.

## Como rodar o projeto completo

1. **Backend** — siga `backend/README.md` (sobe o PostgreSQL, instala dependências, cria as tabelas e inicia a API em `http://localhost:3000`).
2. **Web** — siga `web/README.md` (aponta para a API e abre em `http://localhost:5173`).
3. **Mobile** — siga `mobile/README.md` (ajusta a URL da API para o IP acessível pelo celular/emulador e abre no Expo Go).

## Próximos passos sugeridos

- Mural comunitário (avisos, empréstimo de equipamentos, produtos disponíveis)
- Notificações/alertas de manutenção preventiva (ex: "troca de óleo a cada 250h")
- Relatórios de custo por máquina/período
