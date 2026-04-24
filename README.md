# 🎮 Joguebet — GamesClub

Plataforma do clube de jogos **Joguebet**. Cadastre jogos avaliados pelo grupo, acompanhe notas, distribua prêmios do **Joguebet Awards** e sorteie o próximo jogo da rodada.

> 🌐 **Acesse:** https://main.dw4wzszmai11a.amplifyapp.com

---

## ✨ Funcionalidades

| Feature | Descrição |
|---------|-----------|
| 📋 **Catálogo de Jogos** | Lista todos os jogos avaliados com nota visual (ScoreRing animado), imagem de capa e gênero |
| ➕ **Adicionar Jogo** | Cadastra um novo jogo com nome, gênero, nota (0–10) e upload de imagem |
| ✏️ **Editar / 🗑️ Deletar** | Atualiza ou remove jogos existentes via modal |
| 🏆 **Joguebet Awards** | Sistema de premiação com medalhas visuais e tooltips no card do jogo |
| 🎰 **Sortear Jogo** | Máquina caça-níquel animada com sons e confetti para escolher o próximo jogo |
| 👥 **Staff** | Página dos membros do clube com foto e descrição |
| 🌗 **Tema Dark/Light** | Toggle de tema com persistência em localStorage |

---

## 🏆 Joguebet Awards

O clube realiza premiações anuais. Categorias disponíveis:

🏆 Jogo do Ano · 📖 Melhor Narrativa · 🎁 Melhor Surpresa · 😭 Jogo Emoção · 🦸 Melhor Protagonista · 🎨 Melhor Arte · 🎵 Melhor Trilha Sonora · 🖼️ Melhor Capa · 💩 Pior Capa · 🎣 Melhor Pesca

Os prêmios aparecem como medalhas no card do jogo. Passe o mouse para ver o nome completo e o ano.

---

## 🛠️ Tech Stack

| Camada | Tecnologias |
|--------|-------------|
| **Frontend** | Next.js 15 · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion |
| **Backend** | AWS Lambda (Node.js 22) · API Gateway REST · DynamoDB · S3 |
| **Infra** | Terraform (modularizado) · AWS Amplify (SSR auto-deploy) |

---

## 🚀 Rodando Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) `>= 18.18.0`
- npm

### Setup

```bash
git clone https://github.com/LuanHii/Joguebet-gamesclub-front.git
cd Joguebet-gamesclub-front
npm install
npm run dev
```

Acesse `http://localhost:3000`.

---

## 📁 Estrutura do Projeto

```
app/
├── page.tsx                # Catálogo de jogos avaliados
├── adicionar/page.tsx      # Formulário de adição (com prêmios)
├── sortear/page.tsx        # Máquina de sorteio
├── staff/page.tsx          # Participantes do clube
├── globals.css             # Tema light/dark (CSS variables)
└── components/
    ├── GameCard.tsx         # Card com ScoreRing, medalhas e tooltips
    ├── UpdateModal.tsx      # Modal de edição (HeadlessUI)
    ├── NavBar.tsx           # Navegação responsiva
    ├── ControlPanel.tsx     # Painel do sorteio
    ├── RaffleMachine.tsx    # Slot machine animada
    ├── PoolList.tsx         # Lista de itens do sorteio
    ├── SkeletonCard.tsx     # Loading skeleton
    └── ThemeToggle.tsx      # Switch dark/light
```

---

## 🔌 API Endpoints

Base URL: `https://6u1nmldbfg.execute-api.us-east-2.amazonaws.com/dev`

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/jogos` | Lista todos os jogos |
| `POST` | `/jogos` | Adiciona um novo jogo |
| `PUT` | `/jogos/{id}` | Atualiza um jogo existente |
| `DELETE` | `/jogos/{id}` | Remove um jogo |
| `POST` | `/presigned-url` | Gera URL para upload de imagem ao S3 |

---

## 🧑‍🤝‍🧑 Contribuindo

1. Crie uma branch: `git checkout -b minha-feature`
2. Commite: `git commit -m "feat: minha alteração"`
3. Suba: `git push origin minha-feature`
4. Abra um **Pull Request** no [repositório](https://github.com/LuanHii/Joguebet-gamesclub-front)

---

## 👾 Staff

| | Nome | Papel |
|---|------|-------|
| 🎮 | **Luan** |
| 💖 | **Karen** |
| 🔥 | **Peco** |
| 🎭 | **Leonardo** |
| 🌙 | **Duda** |
| 😌 | **Piter** |