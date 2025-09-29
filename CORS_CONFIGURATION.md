# 🚀 Configuração de CORS e Conexão Frontend-Backend

## ✅ Configurações Implementadas

### 1. **Backend - Configuração de CORS**
A configuração de CORS foi adicionada ao `Program.cs` do backend:

```csharp
// CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Pipeline configuration
app.UseCors("AllowAngularApp");
```

### 2. **Serviços Angular Criados**
- **AuthService**: Para autenticação (login/register/logout)
- **NasaService**: Para integração com NASA API
- **AuthComponent**: Componente de teste para login/registro

## 🔧 Como Executar e Testar

### 1. **Executar o Backend**
```bash
cd backend
dotnet run --project WeatherTrackerAPI.csproj
```
- URL Backend: `http://localhost:5170`
- Swagger: `https://localhost:7230/swagger`

### 2. **Executar o Frontend**
```bash
cd frontend
ng serve
```
- URL Frontend: `http://localhost:4200`

### 3. **Testar a Conexão**

#### **A. Health Check (sem autenticação)**
```bash
curl -X GET "http://localhost:5170/health"
```

#### **B. Registrar um usuário**
```bash
curl -X POST "http://localhost:5170/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "MinhaSenh@123",
    "confirmPassword": "MinhaSenh@123",
    "firstName": "Teste",
    "lastName": "Usuario"
  }'
```

#### **C. Fazer Login**
```bash
curl -X POST "http://localhost:5170/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "MinhaSenh@123"
  }'
```

#### **D. Acessar NASA API (com token)**
```bash
curl -X GET "http://localhost:5170/api/nasa/apod" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🎯 URLs de Teste no Frontend

### 1. **Componente de Autenticação**
Adicione no `app.component.html`:
```html
<app-auth></app-auth>
```

### 2. **Testar no Navegador**
1. Acesse: `http://localhost:4200`
2. Use o formulário de registro para criar um usuário
3. Faça login com as credenciais
4. Verifique no console do navegador as chamadas à API

## 🔑 Configurações Necessárias

### 1. **NASA API Key**
Configure no `appsettings.json` do backend:
```json
{
  "NasaApiSettings": {
    "BaseUrl": "https://api.nasa.gov/planetary/apod",
    "ApiKey": "SUA_CHAVE_NASA_API_AQUI"
  }
}
```

### 2. **Connection String SQL Server**
Configure no `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost\\MSSQLSERVER01;Database=weather_trackerapi;User Id=developer;Password=YourPassword;TrustServerCertificate=true;"
  }
}
```

## 🛠️ Verificações de Conectividade

### 1. **CORS Headers**
Verifique nas ferramentas de desenvolvedor do navegador se os headers CORS estão presentes:
- `Access-Control-Allow-Origin: http://localhost:4200`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE`
- `Access-Control-Allow-Headers: *`

### 2. **Network Tab**
No DevTools do navegador, monitore a aba Network para:
- Status 200 para requisições bem-sucedidas
- Status 401 para não autenticado
- Status 400/500 para erros

### 3. **Console Logs**
Verifique logs no console para:
- Tokens JWT sendo salvos
- Chamadas à API sendo executadas
- Erros de autenticação ou CORS

## 📱 Próximos Passos

1. **Implementar Guards**: Proteger rotas que precisam de autenticação
2. **Interceptors**: Adicionar tokens automaticamente nas requisições
3. **Error Handling**: Melhorar tratamento de erros
4. **Loading States**: Adicionar indicadores de carregamento
5. **UI Components**: Criar componentes para visualizar dados da NASA

A configuração de CORS está completa e o frontend pode agora se comunicar com o backend! 🎉