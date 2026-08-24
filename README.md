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

### Client — calibrado para League Client 1280 × 720

O League Client deve permanecer em tamanho nativo, sem stretch.

- overlay: `/client`
- League Client Window Capture: x `120` / y `124` / `1280 × 720`
- webcam: x `144` / y `621` / `360 × 203`
- chat: x `1424` / y `124` / `376 × 720`

No OBS, para a captura do League Client:

1. Transformar → Redefinir transformação
2. Editar transformação
3. Posição X: `120`
4. Posição Y: `124`
5. Tamanho: `1280 × 720`
6. Não esticar para preencher a moldura

### In-game

- overlay: `/ingame`
- webcam sugerida: x 34 / y 843 / 360 × 203
- jogo permanece em tela cheia

## Estado atual

- QR Code: fora por enquanto
- dados de follower/KDA/WL: não existem na arte
- chat fictício: somente com `?demo=1`
- chat real da Twitch: próxima etapa
