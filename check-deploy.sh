#!/bin/bash

echo "🔍 Verificando status do GitHub Pages..."
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "📦 Repositório: https://github.com/ArielFontes98/University-Tiers"
echo ""

echo "1️⃣  Configure o GitHub Pages:"
echo "   ${YELLOW}https://github.com/ArielFontes98/University-Tiers/settings/pages${NC}"
echo "   → Selecione 'GitHub Actions' como Source"
echo ""

echo "2️⃣  Verifique o status do workflow:"
echo "   ${YELLOW}https://github.com/ArielFontes98/University-Tiers/actions${NC}"
echo "   → Aguarde o ícone ficar verde ✅"
echo ""

echo "3️⃣  Acesse o site quando o deploy estiver completo:"
echo "   ${GREEN}https://arielfontes98.github.io/University-Tiers/${NC}"
echo ""

echo "📝 Instruções completas: DEPLOY_INSTRUCTIONS.md"
echo ""

# Tentar verificar se o site já está no ar
echo "🌐 Testando se o site já está disponível..."
if command -v curl &> /dev/null; then
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://arielfontes98.github.io/University-Tiers/ 2>/dev/null)
    if [ "$STATUS" = "200" ]; then
        echo "   ${GREEN}✅ Site está no ar!${NC}"
        echo "   Acesse: https://arielfontes98.github.io/University-Tiers/"
    elif [ "$STATUS" = "404" ]; then
        echo "   ${YELLOW}⏳ Site ainda não foi publicado (404)${NC}"
        echo "   Siga os passos acima para configurar."
    else
        echo "   ${YELLOW}⏳ Aguardando deploy... (Status: $STATUS)${NC}"
    fi
else
    echo "   ℹ️  Instale curl para verificar automaticamente"
fi

echo ""
echo "💻 Para rodar localmente:"
echo "   cd /Users/ariel.fontes/university-tiers"
echo "   npm run dev"
echo ""

