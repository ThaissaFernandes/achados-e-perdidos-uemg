Markdown
# FindIT — Sistema de Achados e Perdidos

> **Trabalho de Conclusão de Curso (TCC)**  
> **Tema:** Desenvolvimento de Interface Web Mobile para um Sistema de Achados e Perdidos com foco em Interação Humano-Computador (IHC)  
> **Instituição:** Universidade do Estado de Minas Gerais (UEMG) — Campus Divinópolis  

---

## 📌 Sobre o Projeto

O **FindIT** é uma aplicação web mobile projetada para otimizar o fluxo de devolução e recuperação de pertences perdidos no campus da UEMG Divinópolis. O foco central da pesquisa reside na aplicação rigorosa de diretrizes de **Interação Humano-Computador (IHC)**, **Usabilidade** e nas **Heurísticas de Nielsen**, visando minimizar a carga cognitiva dos usuários e entregar uma navegação intuitiva.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [React.js](https://react.dev/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Backend & Auth:** [Firebase](https://firebase.google.com/) (Firestore / Authentication)
- **Navegação:** [React Router Dom](https://reactrouter.com/)
- **Design & Prototipagem:** [Figma](https://figma.com/)
- **Modelagem:** Diagramas UML (Casos de Uso e Classes)

---

## Estrutura do Repositório

```text
achados-e-perdidos-uemg/
├── docs/                   # Artefatos de IHC, UML e links do Figma
├── src/
│   ├── assets/             # Imagens, marcas e ícones estáticos
│   ├── components/         # Componentes reutilizáveis (common, layout, items)
│   ├── config/             # Configurações do SDK do Firebase
│   ├── context/            # Gerenciamento de estado global (ex: AuthContext)
│   ├── pages/              # Páginas da aplicação (Home, Login, Perfil, etc.)
│   ├── routes/             # Definição e proteção das rotas da aplicação
│   ├── services/           # Regras de negócio e integração com a API/Firebase
│   └── styles/             # Importações globais do Tailwind CSS
```

## Como Executar o Projeto Localmente
Pré-requisitos
Node.js (versão 18 ou superior)

## Gerenciador de pacotes npm

Passo a Passo
Clonar o repositório:

git clone [https://github.com/SEU-USUARIO/achados-e-perdidos-uemg.git](https://github.com/SEU-USUARIO/achados-e-perdidos-uemg.git)
cd achados-e-perdidos-uemg
Instalar as dependências:

npm install

Configurar Variáveis de Ambiente:

Crie um arquivo .env.local na raiz do projeto e insira as chaves do seu projeto Firebase:  

Code snippet
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_auth_domain
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
Executar o servidor de desenvolvimento:

npm run dev
Acesse a aplicação no navegador em http://localhost:5173.

## Foco em IHC e Usabilidade
A interface foi desenvolvida seguindo princípios de arquitetura de informação voltados para ambientes acadêmicos:

Mobile First: Priorização de layouts responsivos otimizados para telas de smartphones.

Redução da Carga Cognitiva: Formulários diretos e busca simplificada com filtros categóricos.

Feedback Visual Claro: Notificações de estado (sucesso, erro, carregamento) baseadas na 1ª Heurística de Nielsen (Visibilidade do Status do Sistema).