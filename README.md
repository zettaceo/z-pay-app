# Z-PAY — Dashboard de Pagamentos

Dashboard operacional da Z-PAY com ZION AI (Claude/Anthropic).

## Deploy na Vercel

1. Push no GitHub
2. Conecte na Vercel (SEM framework — detecta automaticamente como Static Site)
3. Em Settings > Environment Variables, adicione:
   - `ANTHROPIC_API_KEY` = sua chave da Anthropic
4. Deploy automático

## ZION AI

O ZION chama `/api/zion` (serverless function) que faz proxy para a Anthropic API.
Zero dados sensíveis no browser. Se a API key não estiver configurada, usa fallback local.

## Estrutura

```
index.html      # Dashboard principal (login + app)
app.js          # Lógica: dashboard, ZION, tour, contador, reconciliação
style.css       # Estilos completos
i18n.js         # Internacionalização (PT/EN/ZH)
api/zion.js     # Serverless: proxy Anthropic Claude
checkout.html   # Página de checkout
linkbio.html    # Link-in-bio
manifest.json   # PWA
vercel.json     # Config Vercel
zpay-logo.png   # Logo
zpay-og.png     # Preview WhatsApp/social
zion_zpay.png   # Avatar ZION
```
