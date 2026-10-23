# langscope · v0.15

Explore 22 linguagens de programação por dificuldade e uso. Compare duas linguagens lado a lado, com exemplos de código e saídas esperadas.

**[Acessar o site](https://langscope.vitorcomc.com.br)** · domínio previsto para o deploy no Cloudflare Pages.

![Home do langscope no desktop: hero e início do ranking](docs/home-desktop.png)

- Ranking com busca, filtro por área e ordenação.
- Comparação de código, saída esperada e critérios de dificuldade. Hoje, os exemplos calculam `2 + 2`.
- Interface responsiva, heroes interativas e respeito à preferência por movimento reduzido.

Feito com HTML, CSS e JavaScript, sem frameworks ou dependências de execução.

## Rodar localmente

Com Node.js instalado, sem precisar instalar pacotes:

```sh
npm run dev
```

Abra [localhost:4173](http://localhost:4173). Os dados das heroes precisam de um servidor HTTP; abrir o HTML diretamente não basta.

## Cloudflare Pages

Conecte este repositório ao Pages com estas configurações:

| Campo | Valor |
| --- | --- |
| Branch de produção | `main` |
| Framework | `None` |
| Diretório raiz | raiz do repositório |
| Comando de build | `npm run build` |
| Diretório de saída | `dist` |

O build copia somente o site e os cabeçalhos de segurança para `dist/`. Não exige variáveis de ambiente nem tokens. Depois do primeiro deploy, associe `langscope.vitorcomc.com.br` em **Custom domains**. [Guia do Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/).

## Dados e limites

O uso vem da [Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology/data/languages), de Stack Exchange Inc., sob ODbL 1.0. Representa adoção entre respondentes, não vagas de emprego. Popularidade é esse uso normalizado de 0 a 10. Dificuldade é uma estimativa educacional própria; SQL não recebe nota comparável. O site mostra saídas esperadas e não executa os códigos.

Dados, exemplos e pesos ficam em `app.js`. Artes e motor das heroes ficam em `heroes/` e `assets/`.

## Próximos aprimoramentos

- Ampliar e atualizar os dados, incluindo novas fontes e métricas de mercado.
- Evoluir filtros, UI/UX, acessibilidade e copy.
- Comparar exemplos com diferentes tarefas e tipos de resultado.
- Explorar gamificação e percursos de aprendizagem.
- Melhorar SEO e tornar os dados e a navegação mais acessíveis a agentes.

Sugestões podem ser abertas nas [issues](https://github.com/printvitorcomc/langscope/issues). Para vulnerabilidades, consulte [SECURITY.md](SECURITY.md).

O projeto ainda não possui licença de código aberto. Dados e recursos de terceiros mantêm suas próprias condições; veja [créditos e referências](THIRD_PARTY_NOTICES.md).
