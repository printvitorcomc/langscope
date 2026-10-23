# Segurança

O langscope é um site estático. Não há contas, backend ou execução dos exemplos de código; as escolhas de linguagens ficam no armazenamento local do navegador.

A versão atual recebe correções. Para comunicar uma vulnerabilidade, use o [relato privado de segurança no GitHub](https://github.com/printvitorcomc/langscope/security/advisories/new). Não publique credenciais ou detalhes exploráveis em uma issue pública.

O Cloudflare Pages aplica os cabeçalhos de `_headers`: restrição de scripts à própria origem, bloqueio de incorporação em frames e proteção contra interpretação incorreta de tipos de arquivo. Estilos inline são permitidos porque barras de métricas e controles usam dimensões calculadas. Os logotipos externos usam uma revisão fixa do Devicon; se não carregarem, aparecem siglas.

Não inclua chaves ou tokens no frontend. O deploy por integração com o GitHub dispensa credenciais no repositório.
