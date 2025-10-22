# 🚀 Instruções para Deploy no GitHub Pages

## Passo a Passo para Ativar o GitHub Pages

### 1️⃣ Acesse as Configurações do Repositório

Abra no navegador:
```
https://github.com/ArielFontes98/University-Tiers/settings
```

### 2️⃣ Vá para a Seção Pages

No menu lateral esquerdo, clique em **"Pages"** ou acesse diretamente:
```
https://github.com/ArielFontes98/University-Tiers/settings/pages
```

### 3️⃣ Configure o Source (Origem)

Na seção **"Build and deployment"**:

- **Source**: Selecione **"GitHub Actions"** (não use "Deploy from a branch")

![Configuração](https://docs.github.com/assets/cb-47267/mw-1440/images/help/pages/publishing-source-drop-down.webp)

### 4️⃣ Salvar e Aguardar

- A configuração é salva automaticamente
- O workflow será executado automaticamente no próximo push
- Se já fez push, o workflow já deve estar rodando!

### 5️⃣ Verificar o Deploy

Acesse a aba **Actions** do repositório:
```
https://github.com/ArielFontes98/University-Tiers/actions
```

Você verá o workflow "Deploy to GitHub Pages":
- 🟡 Amarelo = Rodando (aguarde 2-3 minutos)
- ✅ Verde = Deploy concluído com sucesso!
- ❌ Vermelho = Erro (clique para ver detalhes)

### 6️⃣ Acessar o Site

Quando o deploy estiver ✅ verde, acesse:
```
https://arielfontes98.github.io/University-Tiers/
```

---

## 🔧 Troubleshooting

### Se o workflow não aparecer:

1. Certifique-se de que selecionou **"GitHub Actions"** como Source
2. Faça um novo push para forçar a execução:
   ```bash
   cd /Users/ariel.fontes/university-tiers
   git commit --allow-empty -m "trigger: force GitHub Pages deploy"
   git push
   ```

### Se aparecer erro de permissões:

1. Vá em: `Settings` → `Actions` → `General`
2. Na seção **"Workflow permissions"**, selecione:
   - ✅ **"Read and write permissions"**
3. Clique em **Save**

### Se o build falhar:

1. Clique no workflow com erro
2. Veja os logs para identificar o problema
3. Geralmente é falta de dependências ou erro de build

---

## ✅ Checklist Rápido

- [ ] Acessei `Settings` → `Pages`
- [ ] Selecionei **"GitHub Actions"** como Source
- [ ] Verifiquei que o workflow está rodando em `Actions`
- [ ] Aguardei o ícone ficar verde ✅
- [ ] Acessei `https://arielfontes98.github.io/University-Tiers/`

---

## 📱 Teste Local Alternativo

Se quiser testar localmente enquanto o deploy roda:

```bash
# Abra um Terminal NORMAL do macOS (não no Cursor)
cd /Users/ariel.fontes/university-tiers
npm run dev
```

O app abrirá em `http://localhost:5173`

---

## 🎯 Resultado Esperado

Quando tudo funcionar, você verá:
- ✅ 400 cursos carregados
- ✅ Filtros funcionando (Brasil, México, Colômbia, USA, Others)
- ✅ Sliders de peso ajustáveis
- ✅ Tabela com scores e tiers
- ✅ Botão de export CSV funcionando

---

**Dúvidas? Me chama! 🚀**

