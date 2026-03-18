# Postman - Mensageria Email

## Arquivos

- `mensageria-email.postman_collection.json`
- `mensageria-email.postman_environment.json`

## Como importar

1. No Postman, clique em Import.
2. Importe os dois arquivos.
3. Selecione o environment **Mensageria Email - Local**.

## Variaveis do environment

- `baseUrl`: URL da API (padrao `http://localhost:3000`)
- `corretorId`: corretor existente para criar imovel (padrao `1`)
- `imovelId`: preenchida automaticamente ao criar imovel
- `imagePath`: caminho absoluto da imagem no seu computador

## Ordem recomendada de execucao

1. GET `/health`
2. GET `/corretor`
3. POST `/corretor/:id/imovel`
4. POST `/imovel/:id/imagens`
5. GET `/imovel/:id/imagens-temporarias/quantidade`

## Observacoes para teste de imagem

- No request de upload, o campo de form-data deve ser exatamente `image`.
- A collection usa `{{imagePath}}` no arquivo. Ajuste essa variavel para uma imagem real no seu sistema.
- Para processamento completo da fila de imagem, rode tambem o worker de imagem.
