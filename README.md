# FIETZLOL Overlay

Overlay customizado para a Twitch do FIETZLOL, com foco em League of Legends / suporte.

## Rotas

- `/client` — Client do LoL / vídeos / navegador / Just Chatting
- `/ingame` — versão mínima para partida
- `?demo=1` — mostra mensagens fictícias apenas para testar o visual
- `?debug=1` — adiciona fundo escuro para visualizar a transparência no navegador

## Desenvolvimento

```bash
npm install
npm run dev
```

Teste local:

```text
http://localhost:5173/client?demo=1&debug=1
http://localhost:5173/ingame?demo=1&debug=1
```

## Build

```bash
npm run build
```

## Deploy

O repositório está preparado para Cloudflare Workers + Static Assets. O deploy conectado ao GitHub deve ser disparado automaticamente por push na branch `main`.

## OBS

Browser Source:

- 1920 × 1080
- 30 FPS
- `Shutdown source when not visible`: ativado

### Client

- overlay: `/client`
- webcam sugerida: x 76 / y 680 / 420 × 236
- área principal aproximada: x 58 / y 106 / 1455 × 820

### In-game

- overlay: `/ingame`
- webcam sugerida: x 34 / y 843 / 360 × 203
- jogo permanece em tela cheia

## Estado atual

- QR Code: fora por enquanto
- dados de follower/KDA/WL: não existem na arte
- chat fictício: somente com `?demo=1`
- chat real da Twitch: próxima etapa
