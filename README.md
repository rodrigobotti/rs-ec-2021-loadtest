![](https://storage.googleapis.com/golden-wind/experts-club/capa-github.svg)

# Testes de Carga com K6

Nessa aula vamos aprender sobre a importância de testes de performance e sua automatização.

Utilizaremos a ferramenta [k6](https://k6.io) para executar nossos testes 
e aprenderemos como escrever scripts de testes de carga em javascript, a linguagem suportada pela ferramenta.

Código do projeto finalizado no branch [cheat-sheet](https://github.com/rodrigobotti/rs-ec-2021-loadtest/tree/cheat-sheet).

Nesse branch, na pasta `tests/loadtest` você encontrará os seguintes scripts:
- [0-basic.js](https://github.com/rodrigobotti/rs-ec-2021-loadtest/blob/cheat-sheet/tests/loadtest/0-basic.js): exemplo simples
- [1-custom-metrics.js](https://github.com/rodrigobotti/rs-ec-2021-loadtest/blob/cheat-sheet/tests/loadtest/1-custom-metrics.js): exemplo de _custom metrics_
- [2-checks-thresholds.js](https://github.com/rodrigobotti/rs-ec-2021-loadtest/blob/cheat-sheet/tests/loadtest/2-checks-thresholds.js): exemplo de _checks_ e _thresholds_
- [3-user.js](https://github.com/rodrigobotti/rs-ec-2021-loadtest/blob/cheat-sheet/tests/loadtest/3-user.js): exenplo de navegação de usuário
- [4-scenarios.js](https://github.com/rodrigobotti/rs-ec-2021-loadtest/blob/cheat-sheet/tests/loadtest/4-scenarios.js): exemplo do uso de _scenarios_ e _executors_ para simular carga em termos de requests por minuto

## Adicionais

### API local com Docker e make

Para facilitar a execução local sem precisar de `Node.JS`, adicionei uma opção de executar a API alvo dos testes de carga local
via `docker-compose`. Pra automatizar ainda mais, criei um `Makefile` com as tasks.

Caso você esteja num ambiente que suporta a ferramenta `make`, basta executar:

```sh
# inicia a API localmente via docker-compose em modo dettached na porta 3000
make api/start

# para verificar se api está deployada localmente
make api/status

# derruba a api
make api/stop
```

Caso seu ambiente não suporte `make`, é possível executar as instruções `docker-compose` manualmente:

```sh
# inicia a API localmente via docker-compose em modo dettached na porta 3000
docker-compose up -d --build api

# para verificar se api está deployada localmente
docker-compose ps

# derruba a api
docker-compose stop
```

### K6 local com Docker e make

Para automatizar a execução do teste de carga com `k6`, adicionei no `Makefile` instruções para executar o script de teste de carga:

**Note**: nesse caso, ainda precisa do [k6 instalado localmente](https://k6.io/docs/getting-started/installation)

```sh
# executa o k6
# script em `tests/loadtest/index.js`
make test/local
```

Também é possível executar o `k6` via `docker-compose` sem precisar instalá-lo.

**Note**: nesse caso a api local não pode ser referenciada via `localhost:3000`, mas sim pelo nome do service no `docker-compose`, ou seja, `api:3000`.
Em `tests/loadtest/example-docker.js` tem um script referenciando a url corretamente.

Com make:
```sh
# executa o k6 via docker-compose
# script em `tests/loadtest/index.js`
make test/docker
```

Com `docker-compose` diretamente:
```sh
# executa o k6 via docker-compose
# script em `tests/loadtest/index.js`
docker-compose run k6 run /tests/loadtest/index.js
```

### Deploy da API na AWS

Caso você queira deployar a API na sua conta da AWS assim como eu fiz, basta seguir alguns passos.

Antes de listar os passos, vou explicar um pouco sobre a aplicação e seu deploy:

- aplicação definida utilizando-se o [serverless framework](https://www.serverless.com/framework/docs/)
  - api gateway público
  - lambda que responde aos eventos http
- pipeline de CD com [Github Actions](https://github.com/features/actions)
  - pipeline definido em [.github/workflows/deploy.yml](.github/workflows/deploy.yml)
  - executa o deploy utilizando o serverless framework via comand `serverless deploy`

Dessa forma, para deployar a aplicação, é necessário:
- ter um fork do repositório
- ter uma conta da AWS
- ter um usuário com [permissões de deploy](https://medium.com/@Michael_Timbs/creating-a-serverless-deploy-user-with-aws-iam-b2053227534)
- ter Github Actions habilitado no seu repositório (já vem por padrão)
- criar as secrets no seu repositório:
  - `AWS_ACCESS_KEY_ID` = access key id do usuário de deploy
  - `AWS_SECRET_ACCESS_KEY` = access key secret do usuário de deploy
  - `AWS_REGION` = região da aws onde deployar
- executar o pipeline de deploy no github actions (push na master)

Caso você queira construir o dashboard no CloudWatch assim como eu mostrei na aula, [aqui está o json de sua definição](aws/cloudwatch.dashboard.json), basta substituir o `<apigateway.apiId>` pelo valor do appId do apigateway do seu deploy.

**Note**: a criação do dashboard poderia ter sido automatizada para ser criada via `CloudFormation` dentro do `serverless.yml`.

## Expert

| [<img src="https://avatars.githubusercontent.com/u/5365992?v=4" width="75px">](https://github.com/rodrigobotti) |
| :-: |
| [Rodrigo Botti](https://github.com/rodrigobotti) |
