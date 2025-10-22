# 🔧 Troubleshooting Guide

## Tela Branca / Blank Screen

### ✅ SOLUÇÃO RÁPIDA:

**O deploy está processando! Aguarde 2-3 minutos.**

1. **Verifique o status:**
   ```
   https://github.com/ArielFontes98/University-Tiers/actions
   ```
   
2. **Aguarde o ícone ficar verde** ✅

3. **Limpe o cache do navegador:**
   - **Chrome/Edge**: Ctrl+Shift+R (Windows) ou Cmd+Shift+R (Mac)
   - **Safari**: Cmd+Option+E, depois Cmd+R
   - **Firefox**: Ctrl+Shift+R (Windows) ou Cmd+Shift+R (Mac)

4. **Acesse novamente:**
   ```
   https://arielfontes98.github.io/University-Tiers/
   ```

---

## 🔍 Verificar Erros no Navegador

Se ainda estiver branco:

1. **Abra o Console do Desenvolvedor:**
   - Pressione **F12** (Windows/Linux)
   - Ou **Cmd+Option+I** (Mac)

2. **Vá para a aba "Console"**

3. **Procure por erros** (linhas vermelhas)

4. **Logs esperados:**
   ```
   🚀 Starting data load...
   Loading data from JSON: /University-Tiers/data/university_course_criteria_base.json
   Successfully loaded 1136 courses from JSON
   ✅ Loaded 1136 courses
   ✅ Initialized country modifiers: (5) ['Brazil', 'Colombia', 'Mexico', 'Others', 'United States']
   ✅ App ready!
   ```

5. **Se ver "❌ Error"**, copie a mensagem e me avise!

---

## 💻 Servidor Local (Terminal Normal)

### ⚠️ NÃO use o terminal do Cursor!

O terminal integrado do Cursor tem restrições que bloqueiam servidores web.

### ✅ Use o Terminal do macOS:

1. **Abra o app "Terminal"** (Cmd+Espaço, digite "Terminal")

2. **Execute:**
   ```bash
   cd /Users/ariel.fontes/university-tiers
   ./start-local.sh
   ```

3. **OU simplesmente:**
   ```bash
   cd /Users/ariel.fontes/university-tiers
   npm run dev
   ```

4. **Aguarde ver:**
   ```
   VITE v5.x.x ready in XXX ms

   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

5. **Abra** `http://localhost:5173` no navegador

---

## 🐛 Problemas Comuns

### Problema: "Cannot GET /University-Tiers/"

**Causa:** Erro de roteamento ou assets não encontrados  
**Solução:**
- Aguarde o deploy completar
- Limpe o cache do navegador
- Verifique se o workflow completou em Actions

### Problema: "Failed to load data"

**Causa:** Arquivo JSON muito grande ou não encontrado  
**Solução:**
- Verifique o console do navegador
- Veja se o arquivo existe em: `/University-Tiers/data/university_course_criteria_base.json`
- O JSON tem 1.3MB (normal, deve carregar em ~2-3 segundos)

### Problema: Sliders não mudam os scores

**Causa:** Bug foi corrigido na última versão!  
**Solução:**
1. Limpe o cache (Cmd+Shift+R)
2. Aguarde o novo deploy (~2 min)
3. Abra o Score Calculator para ver mudanças
4. Use o botão "Test" para mudanças dramáticas

### Problema: npm run dev falha no Cursor

**Causa:** Sandbox do Cursor bloqueia network  
**Solução:** Use Terminal normal do macOS (não o do Cursor!)

---

## ✅ Checklist de Verificação

Antes de reportar um problema, verifique:

- [ ] Aguardei pelo menos 3 minutos após o push
- [ ] Workflow em Actions está verde ✅
- [ ] Limpei o cache do navegador (Cmd+Shift+R)
- [ ] Tentei em modo anônimo/privado
- [ ] Verifiquei o console do navegador (F12)
- [ ] Li os logs no console

---

## 🆘 Ainda com Problemas?

1. **Abra o console** (F12)
2. **Copie todos os erros** (se houver)
3. **Tire um screenshot**
4. **Me avise com os detalhes!**

---

## 🎯 Status Esperado

Quando tudo está funcionando:

✅ Site carrega em 2-3 segundos  
✅ Mostra "1136 courses • DS/MLE function" no header  
✅ Tabela com cursos visível  
✅ Sliders funcionam (veja Score Calculator!)  
✅ Country modifiers ajustáveis  
✅ Export CSV funciona  

---

**Última atualização:** Deploy com fixes em andamento (~2 min)
