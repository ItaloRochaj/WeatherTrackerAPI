# WeatherTrackerAPI 🚀

Uma API RESTful desenvolvida em .NET 8 que integra com a NASA API para coletar, processar e armazenar dados astronômicos, fornecendo endpoints seguros para consulta de informações espaciais históricas e em tempo real.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Configuração e Instalação](#configuração-e-instalação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Endpoints](#api-endpoints)
- [Autenticação e Autorização](#autenticação-e-autorização)
- [Banco de Dados](#banco-de-dados)
- [Configurações](#configurações)
- [Documentação da API](#documentação-da-api)

## 🌟 Visão Geral

O WeatherTrackerAPI é uma aplicação backend desenvolvida como parte de uma avaliação técnica para demonstrar conhecimentos em:

- **Integração com APIs externas** (NASA API - Astronomy Picture of the Day)
- **Arquitetura em camadas** com .NET 8
- **Autenticação JWT**
- **Persistência de dados** com Entity Framework Core e MySQL
- **Documentação** com Swagger/OpenAPI
- **Boas práticas** de desenvolvimento

### 🎯 Objetivo Principal

Criar uma API que consuma dados da NASA API (Astronomy Picture of the Day - APOD), processe essas informações, as armazene em um banco de dados MySQL e forneça endpoints seguros para consulta de dados históricos e tendências astronômicas.

## 🛠️ Tecnologias Utilizadas

### Backend
- **.NET 8** - Framework principal
- **ASP.NET Core Web API** - Para criação da API REST
- **Entity Framework Core** - ORM para acesso ao banco de dados
- **MySQL** - Banco de dados principal (usando Pomelo.EntityFrameworkCore.MySql)
- **AutoMapper** - Mapeamento entre objetos
- **JWT Bearer** - Autenticação e autorização

### Ferramentas e Bibliotecas
- **Swagger/OpenAPI** - Documentação da API
- **Serilog** - Logging estruturado
- **FluentValidation** - Validação de dados
- **BCrypt.Net** - Hash de senhas
- **Health Checks** - Monitoramento da aplicação

## 🏗️ Arquitetura do Projeto

### Estrutura de Camadas

```
┌─────────────────────────────────────┐
│           Controllers               │ ← Presentation Layer
├─────────────────────────────────────┤
│           Services                  │ ← Business Logic Layer
├─────────────────────────────────────┤
│         Repositories                │ ← Data Access Layer
├─────────────────────────────────────┤
│      Models/Entities                │ ← Domain Layer
└─────────────────────────────────────┘
```

### Principais Funcionalidades

#### 1. ✅ Integração com API de Terceiros
- **NASA APOD API**: Busca dados astronômicos diários
- **Processamento**: Transformação e validação dos dados
- **Cache**: Armazenamento em cache para otimização

#### 2. ✅ Banco de Dados MySQL
- **Entity Framework Core**: ORM para acesso aos dados
- **Migrações**: Controle de versão do banco
- **Consultas otimizadas**: Queries eficientes

#### 3. ✅ Autenticação e Autorização
- **JWT Tokens**: Autenticação stateless
- **Roles**: Controle de acesso baseado em funções
- **Middleware personalizado**: Para logging e validação

## 📋 Pré-requisitos

- **.NET 8 SDK** ou superior
- **MySQL Server** 8.0 ou superior
- **Visual Studio Code** ou **Visual Studio** (recomendado)
- **Git** para controle de versão

## ⚙️ Configuração e Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/ItaloRochaj/WeatherTrackerAPI.git
cd WeatherTrackerAPI
```

### 2. Configure o banco de dados MySQL
Certifique-se de que o MySQL está executando e configure a connection string no `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=weather_trackerapi;User=developer;Password=Luke@2020;Port=3306;"
  }
}
```

### 3. Configure as dependências da NASA API
Atualize a chave da API no `appsettings.json`:

```json
{
  "NasaApi": {
    "BaseUrl": "https://api.nasa.gov/",
    "ApiKey": "SUA_CHAVE_NASA_API_AQUI"
  }
}
```

### 4. Restaure os pacotes e execute as migrações
```bash
dotnet restore
dotnet ef database update
```

### 5. Execute a aplicação
```bash
dotnet run
```

A aplicação estará disponível em:
- **HTTPS**: `https://localhost:7240`
- **HTTP**: `http://localhost:5153`
- **Swagger UI**: `https://localhost:7240` (página inicial)

## 🗂️ Estrutura do Projeto

```
WeatherTrackerAPI/
├── Controllers/           # Controladores da API
│   ├── AuthController.cs
│   └── NasaController.cs
├── Services/             # Lógica de negócio
│   ├── AuthService.cs
│   └── NasaService.cs
├── Repositories/         # Acesso a dados
│   ├── UserRepository.cs
│   └── ApodRepository.cs
├── Models/              # Entidades do domínio
│   ├── User.cs
│   ├── ApodEntity.cs
│   └── ApodResponse.cs
├── DTOs/                # Data Transfer Objects
│   ├── LoginDto.cs
│   ├── RegisterDto.cs
│   └── ApodDto.cs
├── Data/                # Contexto do banco
│   └── AppDbContext.cs
├── Configurations/      # Configurações
│   ├── JwtSettings.cs
│   └── NasaApiSettings.cs
├── Middleware/          # Middlewares personalizados
│   └── JwtAuthenticationMiddleware.cs
├── Mappings/            # AutoMapper profiles
│   └── AutoMapperProfile.cs
├── Extensions/          # Extensions methods
│   └── SwaggerExtensions.cs
└── Migrations/          # Migrações do EF Core
```

## 🔐 API Endpoints

### Autenticação (`/api/auth`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/register` | Registra novo usuário | ❌ |
| POST | `/login` | Login do usuário | ❌ |
| POST | `/validate` | Valida token JWT | ❌ |

### NASA APOD (`/api/nasa`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/apod` | Obtém APOD por data | ✅ |
| GET | `/apod/random` | Obtém APOD aleatória | ✅ |
| GET | `/apod/range` | Obtém APODs em intervalo | ✅ |
| GET | `/apod/stored` | Lista APODs armazenadas | ✅ |
| GET | `/apod/trends` | Obtém tendências | ✅ |
| PUT | `/apod/{id}/rating` | Atualiza avaliação | ✅ |
| POST | `/apod/{id}/favorite` | Favorita/desfavorita | ✅ |
| POST | `/apod/sync` | Sincroniza da NASA | ✅ (Admin) |

### Monitoramento

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Health check da aplicação |

## 🗄️ Banco de Dados

### Tabelas Principais

#### Users
- **Id**: GUID (PK)
- **Email**: VARCHAR(255) UNIQUE
- **PasswordHash**: VARCHAR(255)
- **FirstName**: VARCHAR(100)
- **LastName**: VARCHAR(100)
- **Role**: VARCHAR(50)
- **CreatedAt**: DATETIME
- **IsActive**: BOOLEAN

#### ApodData
- **Id**: GUID (PK)
- **Date**: DATETIME UNIQUE
- **Title**: VARCHAR(500)
- **Explanation**: TEXT
- **Url**: VARCHAR(2000)
- **HdUrl**: VARCHAR(2000)
- **MediaType**: VARCHAR(50)
- **Copyright**: VARCHAR(200)
- **CreatedAt**: DATETIME
- **ViewCount**: INT
- **Rating**: DOUBLE
- **IsFavorited**: BOOLEAN

## 📚 Documentação da API

A documentação completa da API está disponível através do Swagger UI quando a aplicação está em execução:

- **URL**: `https://localhost:7240`
- **Swagger JSON**: `https://localhost:7240/swagger/v1/swagger.json`

### Exemplo de Uso

#### 1. Registrar usuário
```bash
curl -X POST "https://localhost:7240/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "MinhaSenh@123",
    "confirmPassword": "MinhaSenh@123",
    "firstName": "João",
    "lastName": "Silva"
  }'
```

#### 2. Fazer login
```bash
curl -X POST "https://localhost:7240/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "MinhaSenh@123"
  }'
```

#### 3. Obter APOD (com token)
```bash
curl -X GET "https://localhost:7240/api/nasa/apod?date=2024-01-01" \
  -H "Authorization: Bearer SEU_TOKEN_JWT_AQUI"
```

## 🔧 Configurações

### JWT Settings
```json
{
  "JwtSettings": {
    "Secret": "sua-chave-secreta-aqui-minimo-32-caracteres",
    "Issuer": "WeatherTrackerAPI",
    "Audience": "WeatherTrackerAPI-Users",
    "ExpirationInMinutes": 60
  }
}
```

### NASA API Settings
```json
{
  "NasaApi": {
    "BaseUrl": "https://api.nasa.gov/",
    "ApiKey": "sua-chave-nasa-api",
    "RateLimitPerHour": 1000,
    "TimeoutInSeconds": 30
  }
}
```

## 📊 Recursos Implementados

### ✅ Requisitos Obrigatórios
- [x] API Web .NET 8
- [x] Integração com API externa (NASA APOD)
- [x] Controlador para buscar dados externos
- [x] Processamento/transformação de dados
- [x] Persistência em banco de dados (MySQL)
- [x] Autenticação JWT
- [x] Documentação Swagger

### ✅ Funcionalidades Extras
- [x] Cache em memória
- [x] Health checks
- [x] Logging estruturado (Serilog)
- [x] Validação com FluentValidation
- [x] AutoMapper para mapeamentos
- [x] Middleware personalizado
- [x] Paginação
- [x] Sistema de avaliações
- [x] Favoritos

## 🚀 Deploy e Produção

Para deploy em produção, considere:

1. **Variáveis de ambiente** para configurações sensíveis
2. **HTTPS** obrigatório
3. **Rate limiting** para APIs externas
4. **Monitoramento** com Application Insights
5. **Docker** para containerização

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

- **Desenvolvedor**: Italo Rocha
- **Email**: contato@exemplo.com
- **GitHub**: [@ItaloRochaj](https://github.com/ItaloRochaj)

---

**NASA API**: Este projeto utiliza a [NASA Open Data API](https://api.nasa.gov/) para obter dados da Astronomy Picture of the Day (APOD).
- **BCrypt.Net** - Hash de senhas
- **HttpClient** - Requisições HTTP para APIs externas
- **FluentValidation** - Validação de dados
- **Serilog** - Logging estruturado

### Testes
- **xUnit** - Framework de testes
- **Microsoft.AspNetCore.Mvc.Testing** - Testes de integração
- **Moq** - Mocking para testes unitários

## 🏗️ Arquitetura do Projeto

```
WeatherTrackerAPI/
├── 📁 Controllers/          # Controladores da API
├── 📁 Services/            # Lógica de negócio
├── 📁 Repositories/        # Acesso a dados
├── 📁 Models/              # Entidades do domínio
├── 📁 DTOs/                # Objetos de transferência de dados
├── 📁 Data/                # Contexto do banco de dados
├── 📁 Configurations/      # Classes de configuração
├── 📁 Middleware/          # Middleware customizado
├── 📁 Extensions/          # Métodos de extensão
├── 📁 Mappings/            # Perfis do AutoMapper
└── 📁 Tests/               # Testes unitários e integração
```

### Padrões Implementados
- **Repository Pattern** - Abstração do acesso a dados
- **Dependency Injection** - Injeção de dependências
- **DTO Pattern** - Transferência de dados
- **Middleware Pattern** - Processamento de requests
- **Configuration Pattern** - Gerenciamento de configurações

## ⚡ Funcionalidades

### 🔐 Autenticação e Autorização
- [x] Registro de usuários com validação
- [x] Login com JWT tokens
- [x] Middleware de autenticação personalizado
- [x] Proteção de endpoints sensíveis

### 🌌 Integração NASA API
- [x] Consumo da NASA APOD API
- [x] Transformação e validação de dados
- [x] Cache de requisições para otimização
- [x] Tratamento de erros e fallbacks

### 💾 Persistência de Dados
- [x] Armazenamento de dados astronômicos
- [x] Histórico de usuários e consultas
- [x] Queries otimizadas para relatórios
- [x] Migrations automáticas

### 📊 Endpoints da API
- [x] CRUD completo para dados astronômicos
- [x] Consultas com filtros e paginação
- [x] Endpoints de relatórios e estatísticas
- [x] Healthcheck e monitoring

## 📋 Pré-requisitos

### Software Necessário
- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [SQL Server](https://www.microsoft.com/sql-server/sql-server-downloads) ou [SQL Server Express](https://www.microsoft.com/sql-server/sql-server-editions/express)
- [Visual Studio 2022](https://visualstudio.microsoft.com/) ou [VS Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)

### Contas e APIs
- **NASA API Key**: Obtenha gratuitamente em [NASA Open Data](https://api.nasa.gov/)
  - Chave utilizada no projeto: `zR5OaEYqLP8dUuP3TjgJBz7PsVYKQaWOhhbqKgjd`

## 🚀 Configuração e Instalação

### 1. Clone o Repositório
```bash
git clone https://github.com/ItaloRochaj/WeatherTrackerAPI.git
cd WeatherTrackerAPI
```

### 2. Configuração do Banco de Dados
```bash
# Instalar ferramentas EF Core (se não instalado)
dotnet tool install --global dotnet-ef

# Criar e aplicar migrations
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 3. Configuração das Variáveis de Ambiente
Crie um arquivo `appsettings.Development.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=WeatherTrackerDB;Trusted_Connection=true;MultipleActiveResultSets=true"
  },
  "JwtSettings": {
    "SecretKey": "your-super-secret-key-here-minimum-32-characters",
    "Issuer": "WeatherTrackerAPI",
    "Audience": "WeatherTrackerAPI-Users",
    "ExpirationInMinutes": 60
  },
  "NasaApiSettings": {
    "BaseUrl": "https://api.nasa.gov/planetary/apod",
    "ApiKey": "zR5OaEYqLP8dUuP3TjgJBz7PsVYKQaWOhhbqKgjd",
    "RateLimitPerHour": 1000
  }
}
```

### 4. Instalar Dependências
```bash
dotnet restore
```

### 5. Executar a Aplicação
```bash
dotnet run
```

A API estará disponível em:
- HTTP: `http://localhost:5170`
- HTTPS: `https://localhost:7230`
- Swagger UI: `https://localhost:7230/swagger`

## 📁 Estrutura do Projeto

### Controllers
- **AuthController** - Autenticação e registro
- **NasaController** - Operações com dados da NASA
- **HealthController** - Monitoramento da aplicação

### Services  
- **AuthService** - Lógica de autenticação
- **NasaService** - Integração com NASA API
- **UserService** - Gestão de usuários

### Repositories
- **UserRepository** - Operações de usuários
- **ApodRepository** - Dados astronômicos

### Models
- **User** - Entidade de usuário
- **ApodEntity** - Dados astronômicos
- **ApodResponse** - Resposta da NASA API

### DTOs
- **LoginDto** - Dados de login
- **RegisterDto** - Dados de registro  
- **ApodDto** - Transferência de dados astronômicos

## 🔌 API Endpoints

### Autenticação
```http
POST /api/auth/register   # Registro de usuário
POST /api/auth/login      # Login de usuário
POST /api/auth/refresh    # Renovar token
```

### NASA Data
```http
GET    /api/nasa/apod              # Imagem astronômica do dia
GET    /api/nasa/apod/{date}       # Imagem de data específica
GET    /api/nasa/apod/range        # Período de datas
POST   /api/nasa/sync              # Sincronizar dados
GET    /api/nasa/statistics        # Estatísticas
```

### Usuários (Protegido)
```http
GET    /api/users/profile          # Perfil do usuário
PUT    /api/users/profile          # Atualizar perfil
GET    /api/users/history          # Histórico de consultas
```

### Sistema
```http
GET    /health                     # Status da aplicação
GET    /swagger                    # Documentação da API
```

## 🔐 Autenticação e Autorização

### JWT Token Structure
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "User",
  "exp": 1640995200,
  "iss": "WeatherTrackerAPI",
  "aud": "WeatherTrackerAPI-Users"
}
```

### Uso da Autenticação
```http
Authorization: Bearer <jwt-token>
```

### Roles Disponíveis
- **User** - Usuário padrão
- **Admin** - Administrador

## 🗄️ Banco de Dados

### Schema Principal

#### Tabela Users
```sql
CREATE TABLE Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Email NVARCHAR(255) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Role NVARCHAR(50) DEFAULT 'User',
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);
```

#### Tabela ApodData
```sql
CREATE TABLE ApodData (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Date DATE UNIQUE NOT NULL,
    Title NVARCHAR(500) NOT NULL,
    Explanation NTEXT NOT NULL,
    Url NVARCHAR(1000) NOT NULL,
    HdUrl NVARCHAR(1000),
    MediaType NVARCHAR(50) NOT NULL,
    Copyright NVARCHAR(255),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);
```

#### Tabela UserQueries
```sql
CREATE TABLE UserQueries (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    UserId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Users(Id),
    QueryType NVARCHAR(100) NOT NULL,
    QueryParameters NVARCHAR(1000),
    ExecutedAt DATETIME2 DEFAULT GETUTCDATE()
);
```

## ⚙️ Configurações

### appsettings.json
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "WeatherTrackerAPI": "Debug"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=WeatherTrackerDB;Trusted_Connection=true"
  },
  "JwtSettings": {
    "SecretKey": "production-secret-key",
    "Issuer": "WeatherTrackerAPI",
    "Audience": "WeatherTrackerAPI-Users",
    "ExpirationInMinutes": 60
  },
  "NasaApiSettings": {
    "BaseUrl": "https://api.nasa.gov/planetary/apod",
    "ApiKey": "zR5OaEYqLP8dUuP3TjgJBz7PsVYKQaWOhhbqKgjd",
    "RateLimitPerHour": 1000,
    "TimeoutInSeconds": 30
  }
}
```

## 🧪 Testes

### Executar Testes
```bash
# Todos os testes
dotnet test

# Testes com coverage
dotnet test --collect:"XPlat Code Coverage"

# Testes específicos
dotnet test --filter "Category=Unit"
dotnet test --filter "Category=Integration"
```

### Estrutura de Testes
```
Tests/
├── UnitTests/
│   ├── Controllers/
│   ├── Services/
│   └── Repositories/
├── IntegrationTests/
│   ├── API/
│   └── Database/
└── TestHelpers/
    ├── Fixtures/
    └── MockData/
```

## 🚀 Deploy

### Docker
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["WeatherTrackerAPI.csproj", "."]
RUN dotnet restore "WeatherTrackerAPI.csproj"
COPY . .
WORKDIR "/src"
RUN dotnet build "WeatherTrackerAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WeatherTrackerAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WeatherTrackerAPI.dll"]
```

### Comandos Docker
```bash
# Build da imagem
docker build -t weathertracker-api .

# Executar container
docker run -p 8080:80 weathertracker-api
```

## 🤝 Contribuição

### Fluxo de Desenvolvimento
1. Fork do projeto
2. Criar branch feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit das mudanças (`git commit -m 'feat: adicionar nova funcionalidade'`)
4. Push para branch (`git push origin feature/nova-funcionalidade`)
5. Abrir Pull Request

### Padrões de Commit
```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: manutenção
```

## 📈 Roadmap de Desenvolvimento

### Fase 1: Estrutura Base ✅
- [x] Configuração inicial do projeto
- [x] Estrutura de pastas e arquitetura
- [x] Configuração do Git e .gitignore

### Fase 2: Configurações Fundamentais
- [ ] Classes de configuração (JWT, NASA API)
- [ ] Setup do Entity Framework
- [ ] Configuração do AutoMapper
- [ ] Middleware de autenticação

### Fase 3: Modelos e DTOs
- [ ] Entidades do domínio
- [ ] DTOs para transferência de dados
- [ ] Validações com FluentValidation
- [ ] Mapeamentos AutoMapper

### Fase 4: Acesso a Dados
- [ ] Contexto do Entity Framework
- [ ] Repositories base
- [ ] Migrations iniciais
- [ ] Seed de dados

### Fase 5: Serviços de Negócio
- [ ] Serviço de autenticação
- [ ] Integração com NASA API
- [ ] Serviços de usuário
- [ ] Cache e otimizações

### Fase 6: Controladores da API
- [ ] Controller de autenticação
- [ ] Controller da NASA API
- [ ] Validações e tratamento de erros
- [ ] Logging estruturado

### Fase 7: Documentação e Swagger
- [ ] Configuração do Swagger
- [ ] Documentação dos endpoints
- [ ] Exemplos de requisições
- [ ] Schemas OpenAPI

### Fase 8: Testes
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Mocks e fixtures
- [ ] Coverage reports

### Fase 9: Segurança e Performance
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] Health checks
- [ ] Monitoring e métricas

### Fase 10: Deploy e DevOps
- [ ] Dockerização
- [ ] CI/CD pipeline
- [ ] Environment configs
- [ ] Documentation final

---

## 📚 Recursos Úteis

- [NASA Open Data Portal](https://api.nasa.gov/)
- [ASP.NET Core Documentation](https://docs.microsoft.com/aspnet/core/)
- [Entity Framework Core](https://docs.microsoft.com/ef/core/)
- [JWT.IO](https://jwt.io/)
- [Swagger/OpenAPI](https://swagger.io/)

## 📄 Licença

Este projeto é licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

**Italo Rocha**
- GitHub: [@ItaloRochaj](https://github.com/ItaloRochaj)
- LinkedIn: [Italo Rocha](https://linkedin.com/in/italorochaj)

---

⭐ **Se este projeto foi útil para você, considere dar uma estrela!**