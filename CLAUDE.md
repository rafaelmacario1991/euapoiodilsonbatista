# Projeto Dilson Batista — Contexto Técnico

## Missão
Página de abaixo-assinado digital: "Eu Apoio Dilson Batista — Contra a Máfia do Reboque".
Captação de leads (Nome + Email + WhatsApp) com registro em Google Sheets.

## URLs
- **Produção:** https://euapoiodilsonbatista.com.br
- **GitHub:** https://github.com/rafaelmacario1991/euapoiodilsonbatista
- **VPS:** 72.62.10.198 (root) — mesma infra do mkreport

## Stack
- HTML5 + CSS custom properties + Vanilla JS (sem framework)
- Fontes: Oswald (headlines) + Inter (body) via Google Fonts
- Deploy: SCP direto para VPS via PowerShell

## Estrutura de arquivos
```
dilson-batista/
├── index.html              # Landing page principal
├── obrigado.html           # Página pós-assinatura
├── privacidade.html        # Política de Privacidade (LGPD)
├── termos.html             # Termos de Uso
├── sitemap.xml
├── robots.txt              # Permite todos bots IA (GPTBot, ClaudeBot etc)
├── llms.txt                # Contexto para sistemas de IA
├── assets/
│   ├── css/style.css       # Design system completo
│   └── js/main.js          # Contador, beacon, pixel, form
├── img/
│   └── foto-perfil-dilson.jpeg
└── deploy/
    ├── deploy.ps1          # Script de deploy para o VPS
    ├── nginx-mkautosolution.conf  # Config Nginx de referência
    ├── google-apps-script.js      # Script da planilha (referência)
    └── reorder.py          # Script Python para reordenar seções sem corromper UTF-8
```

## Ordem das seções (index.html)
1. Hero — foto + contador + CTA
2. Alerta — urgência/censura (páginas banidas)
3. Formulário — abaixo-assinado (Nome, Email, WhatsApp)
4. Vídeo — embed Instagram https://www.instagram.com/p/DYItCj-RRJZ/
5. Problema — 4 cards Máfia do Reboque
6. Candidato — quem é Dilson + 5 propostas
7. Perseguição Digital — 3 páginas Instagram com status
8. FAQ — 6 perguntas (schema FAQPage)
9. Compartilhar — botão WhatsApp
10. Footer — links legais

## Instagram
- @dilsonbatista_ → SUSPENSA
- @dilsonbatistablitz → EM RISCO
- @dilsonbatistablitz_2026 → ATIVA (link ativo na página)

## Google Sheets
- **Script URL:** https://script.google.com/macros/s/AKfycbxWp3kQiNuCGdwmXC1QX7qqEOdFvfWCK6Oz8R015QX4XnB26itxAUwzM73gX042Tu1e6g/exec
- **Planilha:** aba `Plan1` — colunas: Timestamp | Nome | Email | WhatsApp
- **Envio:** image beacon (new Image().src) — evita CORS do Apps Script
- **Endpoints:**
  - `?action=count` → `{ total: N }`
  - `?nome=&email=&whatsapp=&timestamp=` → `{ status: "ok", total: N }`
- **Proteção:** bloqueia e-mail duplicado

## Meta Pixel
- **ID:** 1006270315196326
- `PageView` → index.html e obrigado.html
- `Lead` → main.js (300ms antes do redirect) + obrigado.html (page load)

## Nginx — /etc/nginx/sites-available/euapoiodilsonbatista.com.br
- HTTP → HTTPS redirect
- www → sem www redirect
- SSL: /etc/letsencrypt/live/euapoiodilsonbatista.com.br/ (expira 09/08/2026)
- Gzip, cache 30d para assets estáticos, headers de segurança

## Deploy
```powershell
# Atualizar o site após mudanças:
cd C:\Users\pc\Desktop\landing-pages-mike\dilson-batista
git add . && git commit -m "update" && git push
.\deploy\deploy.ps1
```

## SSH Key
- Arquivo: C:\Users\pc\.ssh\mkreport_vps
- Usuário: root@72.62.10.198

## Atenção: encoding UTF-8
- NUNCA usar Get-Content / Set-Content do PowerShell 5.1 para editar o HTML
- Sempre usar Python (deploy/reorder.py como referência) ou ferramentas que preservem UTF-8
- Acentos portugueses corrompem com encoding Windows-1252 padrão do PS5.1

## SEO / AI SEO
- Schema.org: WebSite, WebPage, Person, FAQPage
- llms.txt na raiz
- robots.txt permite: Googlebot, GPTBot, ClaudeBot, PerplexityBot, Google-Extended
- Canonical: https://euapoiodilsonbatista.com.br/
- Meta description, OG tags, Twitter Card configurados

## Meta de assinaturas
- 30.000 assinaturas
- Contador animado no hero (busca total real do Sheets)
- Barra de progresso na seção do formulário
