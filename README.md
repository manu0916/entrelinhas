# Entrelinhas — Biblioteca Digital de Trabalhos, Pesquisas e Projetos

**Entrelinhas** é uma plataforma completa e elegante para publicação, leitura integrada e download gratuito de trabalhos acadêmicos, ensaios, relatórios técnicos, cadernos de estudo e projetos.

Projetada com direção visual editorial inspirada em periódicos contemporâneos e cadernos de anotações, a plataforma conta com ilustrações originais em SVG, leitor progressivo de PDF de alta fidelidade e infraestrutura moderna hospedada na borda (*edge*) da **Cloudflare** utilizando **Workers com Static Assets**, **D1** (SQLite relacional) e **R2** (armazenamento de objetos com *streaming range*).

---

## ✦ Identidade Visual & Design Editorial

- **Paleta de Cores:**
  - `Fundo Principal (Papel)`: `#F8F4EB`
  - `Superfícies de Leitura`: `#FFFFFF`
  - `Texto Principal`: `#202B33`
  - `Destaques e Botões Principais`: `#245B57` (Verde Pinheiro)
  - `Detalhes Editoriais`: `#C97552` (Terracota)
  - `Marcações e Elementos Gráficos`: `#EAC568` (Amarelo Caderno)
- **Tipografia:**
  - Títulos: **Fraunces** (serifa editorial expressiva)
  - Textos e Interface: **Manrope** (sem serifa de alta legibilidade)
- **Ilustrações Originais em SVG:**
  - Composição de abertura com caderno aberto, folhas, penas e animação sutil de traço.
  - Marcadores de página em fita para categorização.
  - Sublinhados desenhados e anotações marginais nos destaques.
  - Estante acolhedora de madeira para quando não houver publicações.
  - Lupa investigativa e folhas soltas para buscas sem resultado.
  - Manuscrito arquivado para a página 404.
  - Monograma editorial no cabeçalho e favicon.

---

## ✦ Recursos Principais

### Para os Visitantes (Sem Necessidade de Cadastro)
- **Exploração Fácil:** Busca instantânea por título, resumo e tags; filtros combinados por categoria temática e ano; ordenação por mais recentes, mais antigos e título A-Z.
- **Leitor de Documentos Integrado (PDF.js):**
  - Navegação entre páginas e salto direto.
  - Controles de zoom (ampliar, reduzir, ajustar à largura da tela e tela cheia).
  - Camada de seleção e cópia de citações ativada para documentos com texto vetorial.
  - Carregamento progressivo por streaming (*HTTP Range Requests*), consumindo apenas os bytes das páginas visualizadas.
  - Botão de download rápido sempre visível e link alternativo para abrir o PDF nativo em outra aba.
- **Compartilhamento Eficiente:** URLs canônicas amigáveis (`/trabalhos/slug-da-publicacao`), botão de copiar link com confirmação visual e acionamento da API nativa de compartilhamento (`navigator.share`) em smartphones.
- **Capas Automáticas:** Se uma publicação não possuir imagem de capa personalizada, o sistema gera uma capa tipográfica harmoniosa com diagramação editorial.
- **Totalmente Responsivo:** Layout testado e adaptado desde telas pequenas (320px) até monitores ultrawide.

### Para o Autor / Administrador (`/admin`)
- **Autenticação Segura:** Verificação no servidor com derivação de chave criptográfica WebCrypto (PBKDF2-HMAC-SHA256) e cookies `HttpOnly` com proteção contra ataques de injeção.
- **Gestão Completa de Obras:**
  - Envio de PDF com *drag-and-drop* e barra de progresso real.
  - Validação de limite de 25 MB por publicação.
  - Envio de capa personalizada ou uso da capa tipográfica automática.
  - Inclusão de anexos complementares (slides PPTX, arquivos DOCX, planilhas).
  - Modo Rascunho / Publicado: rascunhos são estritamente privados e não aparecem no catálogo nem podem ser acessados diretamente por visitantes anônimos.
  - Seletor de Destaque na Página Inicial.
  - Modo de pré-visualização antes da publicação.
  - Alerta contra perda de alterações não salvas ao abandonar o formulário.
  - Exclusão segura com modal de confirmação que identifica explicitamente o trabalho a ser removido.
  - Substituição atômica de arquivos no R2.
- **Gestão de Categorias:** Criação, ordenação e exclusão protegida de categorias temáticas.
- **Configurações do Site:** Edição do nome do site (padrão "Entrelinhas"), título de abertura, subtítulo, biografia e apresentação do autor diretamente pelo painel.

---

## ✦ Estrutura do Projeto

```
├── public/                 # Favicon SVG e ativos estáticos
├── src/                    # Aplicação Front-end (React + Vite + TypeScript)
│   ├── components/
│   │   ├── common/         # Header, Footer, AutoCover, WorkCard, Modal, Toast, Skeleton
│   │   ├── illustrations/  # Ilustrações originais em SVG (Hero, Estante, Lupa, 404, etc.)
│   │   └── reader/         # Leitor de PDF progressivo com PDF.js
│   ├── context/            # Contexto de Autenticação do Administrador
│   ├── pages/              # Início, Catálogo, Detalhes, Sobre, 404 e Páginas Admin
│   ├── services/           # Cliente de API e adaptador com suporte offline/dev
│   └── types/              # Definições TypeScript
├── worker/                 # Back-end Cloudflare Workers
│   ├── auth.ts             # Criptografia WebCrypto (PBKDF2) e sessões
│   ├── db.ts               # Consultas e operações no Cloudflare D1
│   ├── storage.ts          # Manipulação e Range Streaming no Cloudflare R2
│   ├── index.ts            # Ponto de entrada, injeção de OpenGraph e roteamento
│   └── routes/             # Rotas públicas, administrativas e autenticação
├── schema.sql              # Esquema SQL do banco de dados D1 com tabelas e índices
├── wrangler.jsonc          # Configuração de deploy da Cloudflare
├── vite.config.ts          # Configuração do Vite com code-splitting e proxy
└── tailwind.config.js      # Paleta de cores oficial e tipografia
```
---

## ✦ Como Rodar Localmente (Desenvolvimento Rápido)

O projeto conta com um ambiente local imediato. Para visualizar a interface e testar o painel administrativo mesmo antes de conectar à sua conta da Cloudflare:

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento do Vite:**
   ```bash
   npm run dev
   ```
   Acesse `http://localhost:5173` no seu navegador.
   - O acervo inicial de exemplo será carregado.
   - Para acessar o painel administrativo, vá em `/admin/login` e utilize a senha:
     `entrelinhas`

---

## ✦ Guia Passo a Passo: Hospedagem na Cloudflare (Produção)

A aplicação utiliza o modelo **Cloudflare Workers com Static Assets**, integrando front-end estático, API serverless de borda, banco de dados D1 e bucket de arquivos R2.

> **Importante:** Apenas enviar a pasta do front-end (como no Cloudflare Pages clássico puro) não é suficiente para uma aplicação com leitor e painel completo, pois é necessário provisionar o banco de dados (D1) e o armazenamento de PDFs (R2) vinculados ao Worker. O processo abaixo faz tudo de forma automatizada e limpa!

### Passo 1: Fazer login no Wrangler (CLI da Cloudflare)
Se você ainda não tiver o Wrangler autenticado em seu computador, execute no terminal:
```bash
npx wrangler login
```
Uma janela do seu navegador será aberta para você autorizar a conexão com a sua conta gratuita da Cloudflare.

---

### Passo 2: Criar o Banco de Dados Cloudflare D1
No terminal, dentro da pasta do projeto, execute:
```bash
npx wrangler d1 create entrelinhas-db
```
O terminal exibirá uma saída similar a esta:
```text
✅ Successfully created DB 'entrelinhas-db'!
Add the following to your configuration file:
[[d1_databases]]
binding = "DB"
database_name = "entrelinhas-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

Copie o valor de `database_id` exibido e cole-o dentro do arquivo `wrangler.jsonc` no campo `"database_id"`.

---

### Passo 3: Inicializar as Tabelas do Banco de Dados
Execute o comando para rodar o arquivo `schema.sql` diretamente no seu banco D1 na nuvem:
```bash
npm run db:init:remote
```
*(Para testes locais com o Miniflare do Wrangler, você também pode rodar `npm run db:init:local`).*

Esse comando criará automaticamente as tabelas `works`, `categories`, `settings`, `admins` e `sessions`, além dos índices de alta performance.

---

### Passo 4: Criar o Bucket Cloudflare R2 para Armazenamento de Arquivos
Execute o comando:
```bash
npx wrangler r2 bucket create entrelinhas-files
```
Isso criará o repositório privado para armazenar seus PDFs, capas e materiais anexos com alta segurança e entrega sem taxas de transferência.

---

### Passo 5: Publicar a Aplicação Completa na Cloudflare
Com o D1 e o R2 configurados, execute o comando de compilação e deploy:
```bash
npm run cf:deploy
```
O Wrangler irá:
1. Compilar e otimizar os arquivos do front-end na pasta `dist/`.
2. Empacotar o Worker com a API e os manipuladores de streaming.
3. Fazer o upload de tudo para a rede global da Cloudflare.
4. Fornecer a URL pública do seu site (por exemplo: `https://entrelinhas.<seu-subdominio>.workers.dev`).

---

## ✦ Primeiro Acesso e Senha do Administrador

Ao acessar `/admin/login` na versão recém-publicada na Cloudflare:
1. Digite a senha desejada no campo de senha (ou a senha padrão `entrelinhas`).
2. O sistema inicializa a tabela de administradores na primeira execução e gera uma chave com salt aleatório e derivação PBKDF2 com 100.000 iterações.
3. Se você desejar trocar a senha posteriormente ou recuperar o acesso, basta rodar uma query direta no D1 via Wrangler:
   ```bash
   npx wrangler d1 execute entrelinhas-db --remote --command="DELETE FROM admins;"
   ```
   Isso permite que você cadastre uma nova senha ao entrar novamente no painel.

---

## ✦ Como Conectar um Domínio Próprio

Se você tiver um domínio registrado (por exemplo: `seunome.com.br` ou `meustrabalhos.com.br`):
1. Acesse o **Painel da Cloudflare** (`dash.cloudflare.com`).
2. Navegue até **Workers & Pages** e clique no Worker `entrelinhas`.
3. Vá na aba **Settings** (Configurações) > **Domains & Routes** (Domínios e Rotas).
4. Clique em **Add** > **Custom Domain** (Adicionar Domínio Personalizado).
5. Digite seu domínio ou subdomínio (ex: `biblioteca.seusite.com.br` ou `seusite.com.br`).
6. A Cloudflare configurará automaticamente os certificados SSL/TLS com HTTPS gratuito e renovação automática!

---

## ✦ Atualizações Futuras sem Perder Arquivos ou Dados

Uma dúvida comum é: *se eu alterar o código ou o visual e fizer um novo deploy, meus trabalhos e arquivos cadastrados serão apagados?*

**Não!** Os dados e arquivos permanecem intactos:
- As publicações e configurações ficam gravadas permanentemente no **Cloudflare D1**.
- Os arquivos PDF, imagens e anexos ficam salvos de forma independente no **Cloudflare R2**.
- Quando você executa `npm run cf:deploy`, **apenas o código da interface e do Worker é atualizado**. Seus arquivos e dados continuam exatamente onde estavam.

---

## ✦ Backup e Exportação de Dados

Você pode exportar cópias de segurança locais sempre que desejar:

### Exportar Banco de Dados (D1)
Execute no terminal:
```bash
npx wrangler d1 export entrelinhas-db --remote --output=./backup-entrelinhas.sql
```
Será gerado um arquivo SQL completo contendo todas as publicações, categorias e configurações.

### Exportar Arquivos (R2)
Você pode baixar os arquivos diretamente pelo painel web da Cloudflare em **R2 Object Storage** > `entrelinhas-files` ou utilizar ferramentas compatíveis com a API S3 da Cloudflare (como o Cyberduck, rclone ou AWS CLI).

---

## ✦ Limites e Custos na Cloudflare (Operação Gratuita e Econômica)

A Cloudflare possui um dos planos gratuitos mais generosos do mercado para sites pessoais e acadêmicos:

| Recurso | Franquia Gratuita da Cloudflare | Observações para o Entrelinhas |
| :--- | :--- | :--- |
| **Cloudflare Workers** | **100.000 requisições/dia** | Mais do que suficiente para centenas de visitas diárias. |
| **Cloudflare D1 (Banco)** | **5 milhões de leituras/dia** e **100.000 escritas/dia** | Permite consultas ultra-rápidas sem custos. |
| **Cloudflare R2 (Arquivos)** | **10 GB de armazenamento grátis** por mês | Equivalente a mais de 1.000 PDFs médios de pesquisas. |
| **Transferência de Download (Egress)** | **Zero taxas de transferência** (gratuito) | O R2 não cobra por tráfego de saída, diferentemente da AWS. |

*Caso o seu acervo exceda 10 GB de arquivos, o custo adicional no plano pago do R2 é de aproximadamente $0.015 por GB/mês (centavos de dólar).*

---

## ✦ Licença & Direitos

Projeto desenvolvido com tecnologias abertas. O código da biblioteca está disponível para uso pessoal, acadêmico e profissional livre.