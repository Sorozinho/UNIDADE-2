# AgroControle - Mobile

Aplicativo mobile (Expo / React Native) para controle de manutenção de máquinas agrícolas, consumindo a mesma API do backend.

## Como rodar

Com o backend rodando (veja `../backend/README.md`):

1. Edite `src/api/client.js` e ajuste `API_URL` para o endereço acessível pelo seu celular/emulador:
   - Emulador Android: `http://10.0.2.2:3000`
   - Dispositivo físico (mesma rede Wi-Fi): `http://SEU_IP_LOCAL:3000`
   - iOS Simulator: `http://localhost:3000` funciona normalmente

2. Instale as dependências e inicie o Expo:

```bash
npm install
npm start
```

3. Escaneie o QR code com o app **Expo Go** (Android/iOS) ou pressione `a`/`i` no terminal para abrir no emulador.

## Telas

- **Login / Cadastro** — autenticação do produtor
- **Minhas máquinas** — lista e cadastro de máquinas/veículos
- **Detalhe da máquina** — histórico de manutenções (abastecimento, óleo, pneu, peças, revisão) e novo registro
