# langscope · v0.4

Mini-app estático, mobile-first, com **22 linguagens de programação**: ranking de dificuldade e adoção, filtros e comparação de códigos equivalentes.

## Funcionalidades

- Ordenação por dificuldade, uso e nome; busca e filtro por área.
- Tabela com linguagem, dificuldade, uso (%) e popularidade (índice relativo de 0 a 10).
- Comparação de duas linguagens para `2 + 2`, descrição acessível acima do código, saída esperada, cópia do código e avaliação da dificuldade.
- Caixas de código compactas, com altura estável, rolagem interna e indicador persistente quando há mais linhas. Saídas compactas e sem notas técnicas adicionais.
- Logotipos das linguagens, navegação por abas e seleções persistidas localmente.
- Menus personalizados, ancorados abaixo dos campos, com rolagem touch e navegação por teclado.
- Ranking com 22 linhas, sem limite de altura nem paginação no mobile.
- Visual escuro, responsivo, sem dependências de framework ou etapa de compilação.
- Duas heroes em largura total, com cerca de 70% da altura da tela, fundos abstratos próprios para desktop e mobile e textos HTML acessíveis.
- Seção ilustrada **Como interpretar esses dados** em Ranking e Comparação, com três cards que distinguem a pesquisa da Stack Overflow, a estimativa de dificuldade e as métricas de uso.
- Nos cards explicativos: destaque ao passar o mouse, inclinação e movimento suave da imagem conforme o cursor, somente em desktop com mouse (a partir de 1024px). Entrada gradual e brilho discreto durante o carregamento das imagens, com respeito à preferência por movimento reduzido.
- Footer compartilhado de tela cheia, com paisagens vetoriais distintas para desktop e mobile, navegação entre visualizações e retorno ao topo.

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
- **Popularidade**: `uso ÷ 62 × 10`, com JavaScript (62%) normalizado em 10. É uma escala relativa de utilização, não uma contagem de vagas.
- **Dificuldade**: avaliação analítica de aprendizagem inicial, não resultado de experimento científico. Pesos: conceitos 35%, sintaxe 30%, complexidade técnica 20%, ferramentas 15%.
- **SQL**: sem dificuldade numérica comparável, por ter finalidade declarativa.
- **Bash/Shell e Assembly**: a pesquisa agrupa dialetos; o laboratório usa Bash e Linux x86-64 NASM.
- **Código**: exibe a saída **esperada**, não executa linguagens no navegador.

## Estrutura

```
index.html         marcação e navegação
styles.css         visual e responsividade
footer.css         footer e transição contínua
footer-scene.js    extensão do céu em Canvas, desenhada apenas ao entrar/redimensionar
interpretation.css animações de entrada, carregamento e hover dos cards explicativos
interpretation.js  entrada ao aparecer e interação do mouse apenas no desktop
app.js             dados, ranking, filtros e comparação
favicon.svg        ícone da aba
icons/             símbolos genéricos para SQL e Assembly
assets/            4 fundos WebP das heroes, 3 ilustrações explicativas e 2 paisagens SVG
tools/             servidor de prévia e ferramenta opcional de vetorização
README.md          documentação
```

Para atualizar linguagens, exemplos, categorias ou critérios, edite o array `LANGUAGES` e os pesos `FACTORS` em `app.js`.

## Footer vetorial

As duas paisagens são **SVGs reais**: contornos Bézier obtidos das referências fornecidas. Não há PNG/WebP, base64, elemento `<image>` ou textura raster embutida nesses SVGs. O navegador baixa somente a composição escolhida pelo `<picture>`: retrato em telas estreitas/verticais; paisagem nas demais.

A composição, a paleta azul e creme, o cavaleiro, o relevo, a vegetação e as estruturas celestes vêm das referências. A vetorização reduz variações muito pequenas de tom e microtextura; não é uma reprodução idêntica pixel a pixel nem uma recuperação de detalhes ausentes nos PNGs. Os contornos escalam sem a grade de pixels da imagem original.

| Arte | SVG sem compressão | Com gzip | WebP anterior |
| --- | ---: | ---: | ---: |
| Desktop | 3.55 MB | 617 KB | 723 KB |
| Mobile | 2.53 MB | 398 KB | 607 KB |

Valores decimais aproximados. Os tamanhos gzip foram medidos localmente. Para obter esse peso de transferência, a hospedagem precisa servir os SVGs com compressão HTTP; sem ela, serão transferidos os tamanhos brutos. O servidor de prévia incluído comprime SVG, HTML, CSS e JavaScript. Não há dependência de Node no site publicado.

A transição e o footer compartilham **um único fundo contínuo**. O azul surge gradualmente do cinza da interface; a transparência dos SVGs permite que o mesmo céu continue atrás da gravura. Não há espelhamento ou emenda entre imagens.

O Canvas estende estrelas e linhas orbitais pela chegada. Ele é desenhado sob demanda, tem limite de 2 milhões de pixels de backing store e não executa um loop de animação. A atmosfera usa uma animação CSS suave, pausada fora da região e em abas ocultas; `prefers-reduced-motion` desativa a animação.

No desktop e no mobile, o retorno ao topo é uma seta em círculo `#151515`, igual ao fundo do site, com nome acessível para leitores de tela. A versão fica abaixo da descrição, sem badge. A navegação usa a lógica existente de `app.js`, preservando a visualização ativa ao voltar ao topo.

Prévia opcional, sem instalação de pacotes:

```bash
npm run dev -- --port 4173
```

A ferramenta `tools/vectorize-footer.py` é utilizada somente para gerar os SVGs offline; requer Python, Pillow, NumPy e libpotrace. Não é executada no navegador nem no deploy.
