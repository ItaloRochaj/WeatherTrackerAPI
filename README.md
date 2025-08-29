# WeatherTrackerAPI 🚀

Uma API RESTful desenvolvida em .NET 9 que integra com a NASA API para coletar, processar e armazenar dados astronômicos, fornecendo endpoints seguros para consulta de informações espaciais históricas e em tempo real.

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
- [Testes](#testes)
- [Deploy](#deploy)
- [Contribuição](#contribuição)
- [Roadmap de Desenvolvimento](#roadmap-de-desenvolvimento)

## 🌟 Visão Geral

O WeatherTrackerAPI é uma aplicação backend desenvolvida como parte de uma avaliação técnica para demonstrar conhecimentos em:

- **Integração com APIs externas** (NASA API)
- **Arquitetura em camadas** com .NET 9
- **Autenticação JWT**
- **Persistência de dados** com Entity Framework Core
- **Documentação** com Swagger/OpenAPI
- **Boas práticas** de desenvolvimento

### 🎯 Objetivo Principal

Criar uma API que consuma dados da NASA API (Astronomy Picture of the Day - APOD), processe essas informações, as armazene em um banco de dados e forneça endpoints seguros para consulta de dados históricos e tendências astronômicas.

## 🛠️ Tecnologias Utilizadas

### Backend
- **.NET 9** - Framework principal
- **ASP.NET Core Web API** - Para criação da API REST
- **Entity Framework Core** - ORM para acesso ao banco de dados
- **SQL Server** - Banco de dados principal
- **AutoMapper** - Mapeamento entre objetos
- **JWT Bearer** - Autenticação e autorização

### Ferramentas e Bibliotecas
- **Swagger/OpenAPI** - Documentação da API
- **Newtonsoft.Json** - Serialização JSON
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