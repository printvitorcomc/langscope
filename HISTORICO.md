# Arquivo histórico do Langscope

Esta branch reúne, em sequência, 17 versões extraídas dos ZIPs fornecidos para preservar a evolução do projeto. Cada commit de snapshot substitui a árvore da versão anterior: os arquivos ficam na raiz do repositório naquele ponto do histórico. Consulte a sequência com `git log --reverse --oneline historico` e abra um snapshot pelo commit indicado abaixo.

A origem são os arquivos ZIP incluídos em `langscope-all-versions.zip`. A ordem da tabela segue a ordem do pacote. O horário é a **data registrada no ZIP (fuso não informado)**; serve como referência do arquivo e não comprova quando o desenvolvimento ocorreu. Os arquivos ZIP não foram publicados.

| Ordem | Data registrada no ZIP (fuso não informado) | Arquivo de origem | Snapshot |
| ---: | --- | --- | --- |
| 1 | 2026-10-22 20:51:10 | `langscope-cloudflare-pages.zip` | `39cec31` — protótipo inicial para Cloudflare Pages |
| 2 | 2026-10-22 21:15:58 | `programming-languages-v0.1.zip` | `14b4b29` — ranking e comparação v0.1 |
| 3 | 2026-10-22 21:30:52 | `langscope-v0.3.zip` | `74e74ea` — interações e layout mobile v0.3 |
| 4 | 2026-10-22 21:59:32 | `langscope-v0.4.zip` | `ced812f` — hero editorial e referências visuais |
| 5 | 2026-10-22 22:03:24 | `langscope-v0.4-revised.zip` | `0652310` — revisão do layout v0.4 |
| 6 | 2026-10-22 22:19:20 | `langscope-v0.4-ajustes-finos.zip` | `52c9ea6` — refinamentos da interface |
| 7 | 2026-10-22 22:36:44 | `langscope-v0.4-ajustes-comparacao.zip` | `26341f9` — controles de comparação |
| 8 | 2026-10-22 22:56:40 | `langscope-v0.4-interpretacao-visual.zip` | `35429a4` — seção visual de interpretação |
| 9 | 2026-10-22 23:05:04 | `langscope-v0.4-interpretacao-espacamento.zip` | `6cd44e8` — espaçamento da seção de interpretação |
| 10 | 2026-10-22 23:22:02 | `langscope-v0.4-secao-interpretacao-refinada.zip` | `30f229e` — refinamento da seção de interpretação |
| 11 | 2026-10-22 23:26:20 | `langscope-v0.4-espacamento-ranking.zip` | `9752f48` — espaçamento do ranking |
| 12 | 2026-10-23 14:37:24 | `langscope-v0.4-footer.zip` | `3b65797` — cena celestial no footer |
| 13 | 2026-10-23 14:51:42 | `langscope-v0.4-footer-refinado.zip` | `92e8b6f` — refinamento da arte e transição do footer |
| 14 | 2026-10-23 14:51:42 | `langscope-v0.4-footer-refinado (1).zip` | Duplicata byte a byte do snapshot 13; sem commit adicional |
| 15 | 2026-10-23 15:21:24 | `langscope-v0.4-footer-refinado (2).zip` | `06399dd` — cena SVG e servidor local |
| 16 | 2026-10-23 15:30:48 | `langscope-v0.4-footer-refinado (3).zip` | `ad21668` — atmosfera do footer e documentação |
| 17 | 2026-10-23 15:42:48 | `langscope-v0.4-footer-refinado (4).zip` | `14db913` — posicionamento da arte de interpretação |
| 18 | 2026-10-23 15:49:38 | `langscope-v0.14.zip` | `093eafc` — módulo de análise de interpretação v0.14 |

## Preparação do arquivo

Foram removidos metadados do macOS (`__MACOSX/`, `.DS_Store` e arquivos `._*`) e os arquivos internos `design-qa.md` e `tools/vectorize-footer.py`, que não fazem parte dos snapshots do site publicados na branch principal. Quando o ZIP continha uma única pasta externa `langscope/`, seu conteúdo foi colocado na raiz do snapshot correspondente.

O arquivo preserva as atribuições e referências de dados presentes nos próprios snapshots, incluindo a licença ODbL indicada para os dados do Stack Overflow Developer Survey. Nenhuma licença de projeto foi adicionada. A branch `historico` é um arquivo de código-fonte e não altera a branch `main` nem a configuração de publicação do site.

Projeto atual: [printvitorcomc/langscope](https://github.com/printvitorcomc/langscope). Branch atual: [historico](https://github.com/printvitorcomc/langscope/tree/historico).
