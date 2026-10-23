# Langscope

Mini-app estático, mobile-first, para explorar **22 tecnologias de programação** por dificuldade estimada, adoção entre desenvolvedores e exemplos equivalentes de código.

**Sem framework, dependências de JavaScript, banco de dados ou build.** Basta abrir `index.html` no navegador. A fonte web é opcional; há fallback para fontes do sistema.

## Funcionalidades

- Ranking com busca, filtros por área e ordenação por dificuldade, uso ou nome.
- Tabela com dificuldade estimada (/10), uso na pesquisa (%), nota de uso normalizada (/10).
- Comparação de duas linguagens lado a lado, código para `2 + 2`, saída esperada e botão para copiar.
- Detalhamento dos quatro critérios de dificuldade, campo metodológico e fonte consultável.
- Layout responsivo, navegação por abas, estado de seleção persistente no navegador.

## Rodar localmente

Abra `index.html` diretamente ou use um servidor HTTP simples:

```bash
python3 -m http.server 8000
```

Depois acesse http://localhost:8000.

## Publicar no GitHub + Cloudflare Pages

1. Crie um repositório no GitHub e envie os arquivos da pasta `langscope` **para a raiz do repositório**.
2. No [Cloudflare Dashboard](https://dash.cloudflare.com/), abra **Workers & Pages → Create → Pages → Import an existing Git repository** e selecione o repositório.
3. Configure o projeto:

   | Campo | Valor |
   | --- | --- |
   | Framework preset | None |
   | Production branch | `main` |
   | Build command | deixe em branco (ou `exit 0`, caso exija) |
   | Build output directory | `.` |

4. Publique. Novos commits na branch de produção geram novos deployments automaticamente.

Documentação: [Cloudflare Pages — Static HTML](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/) · [Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/).

## Origem e interpretação dos dados

- **Adoção:** Stack Exchange Inc. (2026), [Stack Overflow Developer Survey — Programming, scripting, and markup languages](https://survey.stackoverflow.co/2026/technology/data/languages), 14.099 respondentes. Licença de dados: [ODbL 1.0](https://opendatacommons.org/licenses/odbl/1-0/). Indica **uso declarado**, não número de vagas.
- **Nota de uso:** valor relativo a JavaScript (62,0% = nota 10,0); `uso_da_linguagem ÷ 62 × 10`.
- **Dificuldade:** julgamento analítico sobre a aprendizagem inicial, em escala de 1 a 10, com pesos: sintaxe (30%), conceitos (35%), ferramentas (15%), complexidade técnica (20%). Não é uma estatística extraída da pesquisa nem um ranking científico universal.
- **SQL:** linguagem declarativa para bancos de dados, propositalmente sem nota de dificuldade comparável à das linguagens de propósito geral.
- **Bash/Shell e Assembly:** pesquisas agrupam diversas variantes; os exemplos correspondem, respectivamente, a Bash e Linux x86-64 NASM.
- Os exemplos de código apresentam a **saída esperada**. O aplicativo não oferece execução real de outras linguagens no navegador.

## Estrutura

```
index.html   interface e marcação semântica
styles.css   layout e estilos responsivos
app.js       dados, notas, filtros e comparador
favicon.svg  ícone da aba
README.md    instruções e fontes
```

Para alterar notas, categorias ou exemplos, edite o array `LANGUAGES` em `app.js`.
