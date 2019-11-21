# Desafio Software Engineer, Back-end - Pagar.me
## Setup
Com o `docker-compose` instalado:
```
docker-compose up --build
```

## Arquitetura
Essa proposta de arquitetura para um pequeno Payment Service Provider foi pensada para ser escalável, performática e ter alta disponibilidade. Baseada em micro serviços, mensagens e cache.

Todos os endpoints expostos estão atrás de um Gateway, toda a entrada de dados desses endpoints passa por validação usando Joi.

A entrada de transações vai para uma fila de processamento. Todos os gets batem em cache no Redis.

Os serviços de persistência de dados e geração de cache são desacoplados e reagem a mensagens, não requisições http. Por isso podem ser facilmente escalados de acordo com a necessidade.

O coração dos dados é o Postgres. A partir dele são gerados os caches. Em caso de falha de inserção no Postgres, a requisição vai para uma fila de fails. A partir dessa fila podem ser feitas novas tentativas e análise de erros (acho que dead letter queue e política de retries estão um pouco além do escopo desse teste ;). Adicionei endpoints dessas listas apenas para facilitar a leitura. Para testar basta causar um erro na inserção do banco, por exemplo derrubar o container de Postgres, ou provocar um erro manualmente nos serviços de persistência.

A arquitetura foi pensada para rodar em orquestradores que abstraem a escalabilidade como Kubernetes ou Docker Swarm, com um mensageria robusta como Kafka. Ou também serverless como 
AWS Lambda e Azure Function com poucos ajustes. Porém, dado o tempo de teste e simplicidade de demonstração, usei Docker Compose e Redis como mensageria - essa não é uma sugestão de infra de produção.

![Arquitetura PSP](https://i.ibb.co/tHV936L/psp.jpg)


* Gateway - proxy reverso simples

* Transaction Queuer - recebe a requisição de transação e coloca na fila de transações recebidas

* Transaction Persister - pega transação da fila de transações recebidas, persiste e coloca na fila de transações persistidas. Em caso de falha manda para fila de fails

* Playable Persister - pega transação da fila de transações persistidas, processa playable, persiste e coloca na fila de playables persistidos. Em caso de falha manda para fila de fails

* Transaction Cache Writer - pega transação da fila de transações persistidas e grava cache por usuário

* Playable Cache Writer - pega playable da fila de playable persistidos e grava cache por usuário

* Transaction Cache Reader - lê cache de transações

* Playable Cache Reader - lê cache de playables

* Fail Writer - pega da lista de falhas e grava em uma lista simples do Redis, por transações ou playables

* Fail Reader - lê lista de fails por transações ou playables (endpoint ilustrativo, apenas para facilitar o acesso a essas listas)
    

## Tecnologias usadas
* Frameworks - Express Gateway e Express
* Bancos de dados - Postgres e Redis
* Mensageria - Redis Pub Sub
* Testes - Jest e RxJS
* Lint - Standard

## Endpoints
* `POST /client/:clientId/transactions` cria uma transação. Exemplo de payload:
```
{
	"value": 2.90,
	"description": "Água Mineral 1L",
	"payment_method": "debit_card",
	"card_number": "9999999999999999",
	"card_name": "John Doe",
	"card_expiration_date": "1221",
	"card_ccv": "999"
}
```
* `GET /client/:clientId/transactions` lista as transações do cliente
* `GET /client/:clientId/playables` balanço de playables
* `GET /transactions/fails` lista transações que falharam inserção no postgres
* `GET /playables/fails` lista playables que falharam inserção no postgres

## Testes
Com o jest instalado globalmente e a aplicação rodando:
```
cd e2e-tests
npm install
npm run tests
```
Testes de micro serviços ou serverless são amplamente debatidos na comunidade. Especialmente a aplicação de testes de aceitação, integração e testes unitários.
Na minha opinião, quanto mais "peças móveis" tem uma aplicação, os testes de aceitação e integração tornam-se mais importantes.
Nesse assunto compartilho a opinião do Yan, o "Burning Monk":
https://theburningmonk.com/2017/02/yubls-road-to-serverless-architecture-part-2/

No meu dia a dia, se estou trabalhando em uma arquitetura de micro serviços, costumo escrever testes unitários para funções com lógica relevante, mas concentro mais esforço em testes de aceitação e integração.

Da maneira como estruturei essa aplicação, não achei relevante fazer teste unitário para algum arquivo. Sei que essa decisão é discutível e não pretendo ter a última palavra nesse assunto (:

Falando especificamente do código apresentado aqui, considero que o arquivo que contém mais lógica é o que processa playables (`playable-persister/src/playable/create.js`). Porém, acabo testando o comportamento dele ao testar o contrato e os valores de mensageria nos testes end to end.

Nos testes end to end eu valido cenários básicos de sucesso e erros, contratos das integrações e mensagens entre serviços. Utilizei o Observable do RxJS para receber e testar as mensagens assincronamente.