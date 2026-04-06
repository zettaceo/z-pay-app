# Z-PAY App — Dashboard SaaS

Dashboard operacional da Z-PAY com ZION AI copiloto integrado via Anthropic Claude.

## Stack

- **Next.js 15** (App Router)
- **React 19** + **TypeScript**
- **Anthropic Claude API** (server-side via API Route)
- Deploy: **Vercel**

## Arquitetura ZION AI

```
Browser (app.js)              Vercel (server-side)           Anthropic
     │                              │                           │
     │  POST /api/zion              │                           │
     │  { message: "..." }          │                           │
     │ ───────────────────────────> │                           │
     │                              │  POST /v1/messages        │
     │                              │  x-api-key: sk-ant-...    │
     │                              │ ─────────────────────────>│
     │                              │                           │
     │                              │  { content: [...] }       │
     │                              │ <─────────────────────────│
     │  { message: "..." }          │                           │
     │ <─────────────────────────── │                           │
```

**Zero dados sensíveis no browser.** A API key fica exclusivamente no servidor.

## Setup Local

```bash
npm install

# Configure a API key
cp .env.local.example .env.local
# Edite .env.local com sua ANTHROPIC_API_KEY

npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Deploy na Vercel

1. Push do repo no GitHub
2. Conecte na [Vercel](https://vercel.com)
3. **IMPORTANTE:** Em Settings > Environment Variables, adicione:
   - `ANTHROPIC_API_KEY` = sua chave da Anthropic
4. Deploy automático

## O que foi atualizado

- **Mobile sidebar fix:** Menu agora scrolla completo, último item visível com padding adequado
- **ZION AI:** Migrado de GROQ (client-side) para Anthropic Claude (server-side via API Route)
- **Segurança:** API key removida do JavaScript do browser
- **Estrutura:** Convertido para Next.js 15 + TypeScript

## Estrutura

```
src/app/
├── api/zion/route.ts    # API Route — proxy para Anthropic Claude
├── content.ts           # HTML body do dashboard
├── layout.tsx           # Root layout
├── page.tsx             # Página principal
└── PageClient.tsx       # Client component (hydration)
public/
├── app.js               # Lógica do dashboard
├── i18n.js              # Internacionalização (PT/EN/ZH)
├── style.css            # Estilos (com fix mobile)
├── checkout.html        # Página de checkout
├── linkbio.html         # Link-in-bio
├── zpay-logo.png        # Logo
└── zion_zpay.png        # Avatar ZION
```
