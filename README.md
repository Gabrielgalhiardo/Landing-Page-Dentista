# Dra. Camila Meilãn

Site responsivo de odontologia e estética em HTML, CSS e JavaScript. As páginas, fotos, fontes e animações são locais. Não há API, banco de dados, rastreadores ou dependências de aplicação.

## Arquivos

- `docs/`: site pronto para publicar, com `index.html` e assets.
- `config/site.config.json`: textos, marca, serviços e contato do site.
- `build.mjs`: gera `docs/index.html` a partir da configuração.
- `preview.mjs`: servidor local de prévia.
- `CREDITOS.md`: fontes e licenças das imagens e fontes tipográficas.

## Editar e testar

Com Node.js instalado, execute na pasta do projeto:

```sh
node build.mjs
node preview.mjs
```

Abra http://localhost:4173. Para encerrar a prévia, pressione Ctrl+C no terminal. Não é necessário executar npm install.

Edite os textos em `config/site.config.json` e gere o HTML novamente. Os estilos e scripts ficam em `docs/`. Após editar, envie também os arquivos atualizados de `docs/` ao repositório.

## Subir no GitHub

1. Crie um repositório e envie o conteúdo desta pasta, incluindo os arquivos que começam com ponto.
2. Se quiser publicar pelo GitHub Pages, abra **Settings → Pages**.
3. Em **Source**, selecione **Deploy from a branch**; escolha a branch que recebeu os arquivos (normalmente `main`) e a pasta `/docs`, depois salve.

O site já está gerado, sem necessidade de tokens ou de configurar um workflow próprio. Referência: [documentação do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Conteúdo incluído

Esta versão mantém a marca, as fotos e o WhatsApp profissional usados no site. Não inclui histórico de Git, credenciais, arquivos de ambiente, configuração da hospedagem anterior, identificadores internos, caminhos do computador, capturas de tela ou arquivos de trabalho. A lista de dados internos pendentes também foi removida.

O `.gitignore` ajuda a impedir a inclusão acidental de arquivos locais e de credenciais. Este site funciona sem segredos no código.
