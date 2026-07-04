# Gestão Fácil

## Rodar localmente
```bash
npm install
npm run dev
```

## Publicar no GitHub
```bash
git init
git add .
git commit -m "Primeiro commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git push -u origin main
```

## Publicar no Vercel
1. Acesse https://vercel.com/new e importe o repositório do GitHub.
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Clique em Deploy.

Ou via CLI:
```bash
npm i -g vercel
vercel
```
