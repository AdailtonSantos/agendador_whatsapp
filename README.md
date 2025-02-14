# Manual de instalação

## Pré-requisitos

- [Docker](https://www.docker.com/get-started) e [Docker Compose](https://docs.docker.com/compose/install/) instalados
- Node.js (versão recomendada: 20)

## Passo a Passo

### 1. Clone o repositório
```sh
git clone https://github.com/AdailtonSantos/agendador_whatsapp
cd agendador_whatsapp
```

### 2. Configuração do ambiente
Renomeie o arquivo `.env-example` para `.env`:
```sh
cp .env-example .env
```

Edite o arquivo `.env` e configure as seguintes variáveis:

#### Configuração do banco de dados
```sh
DB_HOST=mysql  # Nome do banco de dados na rede do container
DB_PORT=3306   # Porta do banco de dados
DB_ROOT_PASS=  # Senha do usuário root
DB_PASS=       # Senha do usuário do banco
DB_USER=       # Nome do usuário do banco (não utilizar root)
```

#### Configuração do usuário inicial
```sh
ADMINUSER=         # Nome do usuário inicial
ADMIN_USERNAME=    # Username do admin
ADMIN_PASS=        # Senha do admin
```

#### Configuração do JWT
```sh
ACCESS_TOKEN_SECRET=  # Chave de acesso do JWT
SECRET=               # Token secreto do JWT
```

#### Configuração da instância inicial
```sh
INITIAL_INSTANCE_NAME=  # Nome da primeira instância (deve estar criada no Evolution)
```

#### Configuração da API do Evolution
```sh
APIURL=         # URL onde a API do Evolution está hospedada
APIGLOBALKEY=   # Chave global de acesso do Evolution
```

### 3. Subindo os containers
Execute o seguinte comando para iniciar os serviços:
```sh
docker-compose up -d
```

### 4. Acessando o sistema
Após subir os containers, o sistema estará disponível nas portas configuradas.
Frontend: localhost:82
Backend: localhost:8081

### 5. Develop
Para um ambiente de desenvolvimento do front, é necessário subir apenas os containers do Back e do Mysql.
Para isso, basta comentar o bloco do nginx no docker-compose.yml
Feito isso, basta rodar:
```sh
docker compose up
npm run init
```
O Vue estará rodando na porta no localhost:8080 e o back no localhost:8081

### 6. Build
Para alterações, basta editar os arquivos do Vue e em seguida rodar
```sh
npm run build
```
Um novo build do frontend será gerado.
Após isso, rode:
```sh
docker compose down
```
E depois
```sh
docker compose up -d
```
Para subir novamente.

### 7. Logs e Debugging
Para visualizar os logs do serviço, utilize:
```sh
docker-compose logs -f
```

### 8. Parando os containers
Caso precise parar os serviços, utilize:
```sh
docker-compose down
```

Agora o sistema está pronto para uso! 🚀
