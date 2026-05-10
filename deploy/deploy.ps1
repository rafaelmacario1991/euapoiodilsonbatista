# =============================================
# deploy.ps1 — Dilson Batista · mkautosolution.cloud
# Sincroniza arquivos estáticos com o VPS via SCP
# Uso: .\deploy\deploy.ps1
# =============================================

$KEY      = "$env:USERPROFILE\.ssh\mkreport_vps"
$VPS      = "root@72.62.10.198"
$DOMAIN   = "mkautosolution.cloud"
$SITE_DIR = "/var/www/$DOMAIN"
$LOCAL    = Split-Path $PSScriptRoot -Parent

Write-Host "`n🚀 Deploy: $DOMAIN" -ForegroundColor Cyan

# ── Arquivos HTML raiz ────────────────────────
Write-Host "`n[1/3] Enviando HTML..." -ForegroundColor Yellow
@("index.html","obrigado.html","privacidade.html","termos.html","sitemap.xml","robots.txt","llms.txt") | ForEach-Object {
    scp -i $KEY "$LOCAL\$_" "${VPS}:${SITE_DIR}/$_"
    Write-Host "  ✓ $_"
}

# ── Assets ────────────────────────────────────
Write-Host "[2/3] Enviando assets..." -ForegroundColor Yellow
scp -i $KEY "$LOCAL\assets\css\style.css"        "${VPS}:${SITE_DIR}/assets/css/style.css"
scp -i $KEY "$LOCAL\assets\js\main.js"           "${VPS}:${SITE_DIR}/assets/js/main.js"
scp -i $KEY "$LOCAL\img\foto-perfil-dilson.jpeg" "${VPS}:${SITE_DIR}/img/foto-perfil-dilson.jpeg"
Write-Host "  ✓ CSS, JS, imagem"

# ── Reload Nginx ──────────────────────────────
Write-Host "[3/3] Recarregando Nginx..." -ForegroundColor Yellow
ssh -i $KEY $VPS "systemctl reload nginx && echo 'OK'"

Write-Host "`n✅ https://$DOMAIN atualizado!`n" -ForegroundColor Green
