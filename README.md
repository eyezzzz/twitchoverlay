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

O repositório está preparado para Cloudflare Workers + Static Assets. O deploy conectado ao GitHub é disparado automaticamente por push na branch `main`.

## OBS

Canvas real usado neste projeto: **1280 × 720**.

Browser Source:

- Width: `1280`
- Height: `720`
- FPS: `30`
- `Shutdown source when not visible`: ativado

### Client

O League Client é capturado em 1280 × 720, mas é exibido menor dentro da composição para sobrar espaço para chat e identidade visual. A proporção continua 16:9.

- overlay: `/client`
- League Client Window Capture: x `20` / y `60`
- tamanho exibido: `1024 × 576`
- webcam: x `36` / y `446` / `280 × 158`
- chat: x `1060` / y `60` / `200 × 576`

No OBS, para a captura do League Client:

1. Transformar → Redefinir transformação
2. Editar transformação
3. Posição X: `20`
4. Posição Y: `60`
5. Tamanho: `1024 × 576`
6. Crop: `0` em todos os lados
7. Manter a proporção 16:9

### In-game

- overlay: `/ingame`
- jogo: tela inteira 1280 × 720
- webcam: x `20` / y `542` / `280 × 158`
- chat: x `1050` / y `20` / `210 × 420`

## Estado atual

- QR Code: fora por enquanto
- dados de follower/KDA/WL: não existem na arte
- chat fictício: somente com `?demo=1`
- chat real da Twitch: próxima etapa
