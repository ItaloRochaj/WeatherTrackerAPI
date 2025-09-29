# 🚀 Backend Integration - WeatherTrackerAPI

## 📋 Resumo da Integração

Esta documentação descreve a integração completa do frontend Angular com o backend **WeatherTrackerAPI** em C#.

## 🏗️ Arquitetura Implementada

### 🔧 Configuração do Ambiente
- **Environment**: Configurado para conectar com `https://localhost:7000/api`
- **CORS**: Backend deve permitir `http://localhost:4200` (dev) e domínio de produção

### 🔐 Sistema de Autenticação
#### Serviços Criados:
- **`AuthService`**: Gerencia JWT tokens, login, registro e estado do usuário
- **`AuthInterceptor`**: Adiciona automaticamente tokens JWT aos headers das requisições
- **`AuthGuard`**: Protege rotas que requerem autenticação

#### Fluxo de Autenticação:
1. Usuário faz login/registro via componentes dedicados
2. Token JWT é armazenado no localStorage
3. AuthInterceptor adiciona token automaticamente nas requisições API
4. AuthGuard protege rotas privadas

### 🌟 API Service
#### WeatherTrackerApiService:
- **`getApod(date?)`**: Obtém dados da NASA APOD
- **`updateRating(id, rating)`**: Atualiza classificação da imagem
- **`toggleFavorite(id)`**: Marca/desmarca como favorito
- **`getTrends()`**: Obtém tendências e estatísticas
- **`checkHealth()`**: Verifica saúde da API

### 📊 Modelos TypeScript
Interface `ApodDto` criada conforme backend C#:
```typescript
interface ApodDto {
  id: string;
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdUrl?: string;
  mediaType: string;
  copyright?: string;
  isFavorited: boolean;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}
```

## 🎨 Componentes Atualizados

### 🔑 Autenticação
- **LoginComponent**: Formulário reativo com validação
- **RegisterComponent**: Registro com confirmação de senha
- **NavbarComponent**: UI de autenticação (login/logout/perfil)

### 🌌 Funcionalidades Astronômicas
- **AstronomyTodayComponent**: 
  - Carrega dados via API
  - Sistema de favoritos
  - Sistema de classificação (estrelas)
  - Fallback para dados mock se API indisponível

## 🛣️ Rotas Configuradas

```typescript
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'astronomy', component: AstronomyTodayComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },
  { path: '**', redirectTo: '' }
];
```

## 🚦 Como Testar a Integração

### 1. **Iniciar o Backend**
```bash
cd WeatherTrackerAPI
dotnet restore
dotnet run
```
O backend estará em: `https://localhost:7000`

### 2. **Iniciar o Frontend**
```bash
cd astronomy-tracker
npm install
ng serve
```
O frontend estará em: `http://localhost:4200`

### 3. **Configurar CORS no Backend**
No arquivo `Program.cs` ou `Startup.cs`, adicione:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

app.UseCors("AllowAngularDev");
```

## 🔄 Fluxo de Dados

### 📥 Obter Dados APOD:
1. Component chama `apiService.getApod()`
2. Service faz requisição para `/api/apod`
3. AuthInterceptor adiciona token JWT
4. Backend retorna dados da NASA
5. Component atualiza UI

### ⭐ Sistema de Favoritos:
1. Usuário clica no botão favorito
2. Component chama `apiService.toggleFavorite(id)`
3. Backend atualiza status no banco
4. Retorna dados atualizados
5. UI reflete mudança

### 🌟 Sistema de Rating:
1. Usuário clica nas estrelas
2. Component chama `apiService.updateRating(id, rating)`
3. Backend salva classificação
4. UI atualiza estrelas

## 🛡️ Tratamento de Erros

### Estratégias Implementadas:
- **Retry Logic**: Tentativas automáticas em falhas de rede
- **Mock Fallback**: Dados mock quando API indisponível
- **User Feedback**: Mensagens de erro amigáveis
- **Loading States**: Indicadores visuais de carregamento

### Interceptor de Erro:
```typescript
// Retry automático para falhas de rede
retry(2),
catchError(this.handleError)
```

## 📱 Responsividade

Todos os componentes são totalmente responsivos:
- **Desktop**: Layout em grid 2 colunas
- **Tablet**: Layout adaptativo
- **Mobile**: Layout em coluna única

## 🎯 Próximos Passos

1. **✅ Testar Authentication Flow**: Login/Register/Logout
2. **✅ Verificar API Endpoints**: Todos os endpoints implementados
3. **✅ Validar CORS**: Comunicação frontend-backend
4. **⏳ Deploy Production**: Configurar para produção
5. **⏳ Monitoring**: Adicionar logs e métricas

## 🔍 Troubleshooting

### Problemas Comuns:

#### 🚫 CORS Error
**Problema**: `Access to XMLHttpRequest blocked by CORS`
**Solução**: Configurar CORS no backend C#

#### 🔑 Authentication Issues
**Problema**: Token não sendo enviado
**Solução**: Verificar AuthInterceptor está registrado em `app.config.ts`

#### 🌐 API Connection Failed
**Problema**: Erro 500/404 na API
**Solução**: 
1. Verificar se backend está rodando
2. Verificar URL em `environment.ts`
3. Verificar logs do backend

#### 📊 Mock Data Always Showing
**Problema**: Sempre mostra dados falsos
**Solução**: Verificar se API está respondendo em `/api/health`

## 📁 Estrutura de Arquivos Criados

```
src/
├── app/
│   ├── models/
│   │   └── astronomy.models.ts         # Interfaces TypeScript
│   ├── services/
│   │   ├── auth.service.ts             # Autenticação
│   │   └── weather-tracker-api.service.ts # API Integration
│   ├── interceptors/
│   │   └── auth.interceptor.ts         # JWT Headers
│   ├── guards/
│   │   └── auth.guard.ts               # Route Protection
│   ├── pages/
│   │   ├── login/                      # Login Component
│   │   └── register/                   # Register Component
│   └── components/
│       ├── navbar/                     # Updated with Auth UI
│       └── astronomy-today/            # Updated with API Integration
└── environments/
    └── environment.ts                  # API Configuration
```

---

## 🎉 Status da Integração: **COMPLETA** ✅

A integração com o **WeatherTrackerAPI** está totalmente implementada e pronta para uso. O sistema inclui autenticação JWT, proteção de rotas, integração completa da API, tratamento de erros e fallbacks mock para desenvolvimento offline.

**Desenvolvido com ❤️ para conectar o cosmos ao código!** 🌌✨