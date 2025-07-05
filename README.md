# Operação Curiosidade - Sistema de Gerenciamento de Cadastros

![Imagem de demonstração do dashboard do projeto](https://i.imgur.com/gYQ4pG0.png)

## 📝 Sobre o Projeto

**Operação Curiosidade** é uma aplicação web front-end completa projetada para o gerenciamento de cadastros de usuários. A interface permite que administradores realizem operações de CRUD de forma intuitiva e eficiente.

Atualmente, o projeto funciona de forma "client-side", utilizando o `localStorage` do navegador para persistência de dados. Esta abordagem foi escolhida para permitir o desenvolvimento e a prototipação rápida de toda a interface e experiência do usuário.

O próximo grande passo deste projeto é a construção de um **backend robusto com C# e ASP.NET Core**, que substituirá o `localStorage` por um banco de dados relacional, transformando a aplicação em um sistema full-stack completo e escalável.

---

## ✨ Funcionalidades Implementadas

* **Autenticação de Administradores:** Sistema de login e cadastro para administradores, com proteção de rotas.
* **Dashboard Principal:** Apresenta um painel com informações rápidas e acesso às principais funcionalidades.
* **Gerenciamento de Usuários (CRUD):**
    * Criação de novos cadastros através de um modal completo.
    * Visualização de todos os usuários em uma tabela paginada.
    * Edição dos dados de um usuário existente em um modal.
    * Exclusão de usuários com um modal de confirmação.
* **Busca em Tempo Real:** Filtro dinâmico na tabela de usuários.
* **Tema Escuro e Claro:** Toggle para alternar entre os temas, com a preferência do usuário salva no `localStorage`.
* **Modais Personalizados:** Substituição dos `alerts` e `confirms` nativos por modais de aviso e confirmação estilizados e com animações.
* **Design Responsivo:** A interface se adapta para uma experiência de uso otimizada em desktops, tablets e dispositivos móveis.
* **Impressão de Relatórios:** Funcionalidade para gerar uma versão limpa e formatada da tabela de usuários para impressão.

---

## 🚀 Tecnologias Utilizadas

O frontend foi construído utilizando as tecnologias fundamentais da web:

* **HTML5:** Para a estruturação semântica do conteúdo.
* **CSS3:** Para estilização, animações e design responsivo, utilizando Flexbox e Media Queries.
* **JavaScript (ES6+):** Para toda a lógica de manipulação do DOM, eventos, validações e gerenciamento de estado via `localStorage`.

---

## ⚙️ Como Executar o Projeto

Como este é um projeto puramente front-end no momento, não há necessidade de compilação ou instalação de dependências.

1.  Clone este repositório para a sua máquina local:
    ```bash
    git clone https://[URL-DO-SEU-REPOSITORIO].git
    ```
2.  Navegue até a pasta do projeto.
3.  Abra os arquivos `.html` (como `login.html` ou `dashboard.html`) diretamente no seu navegador de preferência.

    *Para uma melhor experiência, é recomendado usar uma extensão como o **Live Server** no VS Code para servir os arquivos localmente.*

---

## 🔮 Próximos Passos

A evolução deste projeto se concentrará no desenvolvimento do backend para transformá-lo em uma aplicação full-stack robusta.

-   [ ] **Desenvolvimento da API REST:** Construir uma API com C# e ASP.NET Core para gerenciar toda a lógica de negócio.
-   [ ] **Integração com Banco de Dados:** Utilizar o Entity Framework Core para conectar a API a um banco de dados (ex: SQL Server, PostgreSQL), garantindo a persistência real dos dados.
-   [ ] **Implementação de Autenticação Segura:** Substituir o sistema de login atual por um sistema baseado em tokens (JWT) com hashing de senhas.
-   [ ] **Refatoração do Frontend:** Modificar o código JavaScript para consumir a nova API (utilizando `fetch`) em vez de manipular o `localStorage`.

---

**Desenvolvido por Vinicius Henrique Cerrone**
