# langscope · v0.4

Mini-app estático, mobile-first, com **22 linguagens de programação**: ranking de dificuldade e adoção, filtros e comparação de códigos equivalentes.

## Funcionalidades

- Ordenação por dificuldade, uso e nome; busca e filtro por área.
- Tabela com linguagem, dificuldade (/10), uso (%) e nota relativa de uso (/10).
- Comparação de duas linguagens para `2 + 2`, saída esperada, cópia do código e avaliação da dificuldade.
- Logotipos das linguagens, navegação por abas e seleções persistidas localmente.
- Menus personalizados, ancorados abaixo dos campos, com rolagem touch e navegação por teclado.
- Ranking com 22 linhas, sem limite de altura nem paginação no mobile.
- Visual escuro, responsivo, sem dependências de framework ou etapa de compilação.
- Duas heroes editoriais compactas, com fundos abstratos independentes para desktop e mobile e textos HTML acessíveis. A interface principal permanece visível na primeira dobra.

## Execução local

Abra `index.html` no navegador ou rode:

```bash
python3 -m http.server 8000
```

Acesse http://localhost:8000.

**Ícones:** os logotipos de 20 linguagens são servidos pelo catálogo [Devicon](https://github.com/devicons/devicon) por meio do jsDelivr. Sem acesso à internet, aparecem as siglas. SQL e Assembly não têm um logotipo universal; os dois usam símbolos genéricos armazenados em `icons/`.

## Publicação no GitHub + Cloudflare Pages

1. Envie o conteúdo desta pasta para a raiz do repositório [printvitorcomc/langscope](https://github.com/printvitorcomc/langscope).
2. No [Cloudflare Dashboard](https://dash.cloudflare.com/), use **Workers & Pages → Pages → Import an existing Git repository**.
3. Configure:

   | Campo | Valor |
   | --- | --- |
   | Framework preset | None |
   | Production branch | `main` |
   | Build command | vazio (ou `exit 0`, se exigido) |
   | Build output directory | `.` |

Documentação: [Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/).

## Dados e limitações

- **Adoção**: Stack Exchange Inc. (2026), [Stack Overflow Developer Survey](https://survey.stackoverflow.co/2026/technology/data/languages). Percentual de respondentes que declararam usar cada tecnologia; **não** representa vagas de emprego. Dados da pesquisa sob [ODbL 1.0](https://opendatacommons.org/licenses/odbl/1-0/).
- **Nota de uso**: `uso ÷ 62 × 10`, com JavaScript (62%) normalizado em 10.
- **Dificuldade**: avaliação analítica de aprendizagem inicial, não resultado de experimento científico. Pesos: conceitos 35%, sintaxe 30%, complexidade técnica 20%, ferramentas 15%.
- **SQL**: sem dificuldade numérica comparável, por ter finalidade declarativa.
- **Bash/Shell e Assembly**: a pesquisa agrupa dialetos; o laboratório usa Bash e Linux x86-64 NASM.
- **Código**: exibe a saída **esperada**, não executa linguagens no navegador.

## Estrutura

```
index.html         marcação e navegação
styles.css         visual e responsividade
app.js             dados, ranking, filtros e comparação
favicon.svg        ícone da aba
icons/             símbolos genéricos para SQL e Assembly
assets/            4 fundos WebP sem texto para as duas heroes
README.md          documentação
```

Para atualizar linguagens, exemplos, categorias ou critérios, edite o array `LANGUAGES` e os pesos `FACTORS` em `app.js`.
