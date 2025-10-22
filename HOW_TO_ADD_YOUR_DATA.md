# 📊 Como Adicionar Seu Arquivo de Dados Completo

## Você tem: `universities_stem_courses_exhaustive_seed.json`

Siga estes passos para usar seus dados completos:

## Passo 1: Adicionar o Arquivo

Copie seu arquivo para o diretório de dados:

```bash
cp /caminho/para/seu/universities_stem_courses_exhaustive_seed.json \
   /Users/ariel.fontes/university-tiers/public/data/
```

Ou manualmente:
- Abra: `/Users/ariel.fontes/university-tiers/public/data/`
- Cole seu arquivo lá

## Passo 2: Atualizar o Loader

Edite o arquivo: `src/utils/dataLoader.ts`

**Linha 6 - ANTES:**
```typescript
const response = await fetch('/University-Tiers/data/universities_stem_courses_seed.json');
```

**Linha 6 - DEPOIS:**
```typescript
const response = await fetch('/University-Tiers/data/universities_stem_courses_exhaustive_seed.json');
```

**Linha 13 (fallback CSV) - Opcional:**
```typescript
const response = await fetch('/University-Tiers/data/universities_stem_courses_exhaustive_seed.csv');
```

## Passo 3: Verificar o Formato

Seu JSON deve seguir este formato:

```json
[
  {
    "Country": "Brazil",
    "University": "Nome da Universidade",
    "City/Region": "Cidade, Estado",
    "STEM Courses (Archetypes)": "Curso 1; Curso 2; Curso 3",
    "Notes": "Observações sobre a universidade"
  }
]
```

### Campos obrigatórios:

| Campo | Tipo | Valores Aceitos |
|-------|------|-----------------|
| `Country` | string | "Brazil", "Mexico", "Colombia", "United States", "Others" |
| `University` | string | Nome completo da universidade |
| `City/Region` | string | Cidade e estado/região |
| `STEM Courses (Archetypes)` | string | Cursos separados por ponto-e-vírgula (`;`) |
| `Notes` | string | Texto livre (pode estar vazio `""`) |

### Validação:

```bash
# Testar se o JSON é válido
cd /Users/ariel.fontes/university-tiers/public/data
python3 -m json.tool universities_stem_courses_exhaustive_seed.json > /dev/null
echo "✅ JSON válido!" || echo "❌ JSON inválido - verifique erros"
```

## Passo 4: Testar Localmente

```bash
cd /Users/ariel.fontes/university-tiers
npm run dev
```

Abra `http://localhost:5173` e verifique:
- ✅ Todas as universidades aparecem
- ✅ Filtros funcionam
- ✅ Cursos STEM aparecem no sidebar
- ✅ Não há erros no console (F12)

## Passo 5: Fazer Build

```bash
npm run build
```

Se der erro, verifique:
- JSON válido (sem vírgulas extras, aspas corretas)
- Campos obrigatórios presentes
- Valores de `Country` exatamente como especificado

## Passo 6: Deploy

```bash
git add .
git commit -m "Add exhaustive university data"
git push origin main
```

O GitHub Actions vai automaticamente fazer o deploy!

---

## 🔧 Dicas Extras

### Se tiver muitas universidades:

O app suporta centenas de universidades sem problemas. A filtragem é instantânea (client-side).

### Se quiser adicionar novos países:

1. Editar `src/types/index.ts`:
   ```typescript
   export type Country = 'Brazil' | 'Mexico' | 'Colombia' | 'United States' | 'Others' | 'Argentina' | 'Chile';
   ```

2. Editar `src/utils/scoring.ts`:
   ```typescript
   export const COUNTRY_MODIFIERS: Record<Country, number> = {
     'Brazil': 1.20,
     'Mexico': 1.10,
     // ... adicione novos países aqui
     'Argentina': 1.00,
     'Chile': 1.05,
   };
   ```

3. Editar `src/components/SidebarFilters.tsx`:
   ```typescript
   const COUNTRIES: Country[] = ['Brazil', 'Mexico', 'Colombia', 'United States', 'Argentina', 'Chile', 'Others'];
   ```

### Se quiser adicionar novos archetypes de curso:

Edite `src/utils/presets.ts` e adicione presets para novos cursos:

```typescript
export const COURSE_PRESETS: Record<string, CriteriaScores> = {
  // ... existentes
  'Cybersecurity': {
    curriculumDepth: 8,
    engineeringFoundations: 9,
    // ... complete com 11 valores
  },
};
```

### Se quiser mudar os pesos dos critérios:

Edite `src/types/index.ts` → `CRITERIA_WEIGHTS`:

```typescript
export const CRITERIA_WEIGHTS = {
  curriculumDepth: 12,  // Aumentar importância
  engineeringFoundations: 8,
  // ...
};
```

### Se quiser mudar os thresholds dos tiers:

Edite `src/utils/scoring.ts` → função `getTier()`:

```typescript
export function getTier(finalScore: number): Tier {
  if (finalScore >= 90) return 0;  // Mais rigoroso
  if (finalScore >= 75) return 1;
  if (finalScore >= 60) return 2;
  return 3;
}
```

---

## ❓ Problemas Comuns

### "Failed to load JSON"
- Verifique se o nome do arquivo está correto
- Verifique se o caminho no `dataLoader.ts` está correto
- Valide o JSON (use [jsonlint.com](https://jsonlint.com))

### "Universidades não aparecem"
- Abra o console (F12) e veja erros
- Verifique se o campo `Country` tem valores válidos
- Verifique se `STEM Courses (Archetypes)` não está vazio

### "Filtros não funcionam"
- Verifique se os nomes dos cursos não têm espaços extras
- Formato correto: `"Curso 1; Curso 2; Curso 3"` (espaço após `;`)

---

## ✅ Checklist Final

Antes de fazer deploy:

- [ ] Arquivo JSON copiado para `/public/data/`
- [ ] `dataLoader.ts` atualizado com novo nome
- [ ] JSON validado (sem erros de sintaxe)
- [ ] Testado localmente (`npm run dev`)
- [ ] Todas universidades aparecem
- [ ] Filtros funcionam
- [ ] Build sem erros (`npm run build`)
- [ ] Commit e push para GitHub
- [ ] GitHub Actions completou com sucesso
- [ ] Site acessível na URL do GitHub Pages

---

**Pronto!** Seu site estará rodando com seus dados completos! 🎉

