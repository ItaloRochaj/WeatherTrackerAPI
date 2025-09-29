# Astronomy Tracker - Instruções de Execução

## Backend (.NET)
O backend está rodando em:
- **HTTPS**: https://localhost:7230
- **HTTP**: http://localhost:5170

### Para iniciar o backend:
```powershell
cd backend
dotnet run --project WeatherTrackerAPI.csproj --launch-profile https
```

## Frontend (Angular)
O frontend está rodando em:
- **URL**: http://localhost:4200

### Para iniciar o frontend:
```powershell
cd frontendtrackerapi/astronomy-tracker
npm start
```

## Teste da Aplicação

### 1. Registro de Usuário
1. Acesse: http://localhost:4200/register
2. Preencha os dados:
   - First Name: Teste
   - Last Name: Usuario
   - Email: teste@exemplo.com
   - Password: Senha123@
   - Confirm Password: Senha123@
3. Clique em "Sign Up"

### 2. Login
1. Acesse: http://localhost:4200/login
2. Use as credenciais criadas acima
3. Clique em "Sign In"

### 3. Páginas Protegidas
Após o login, você pode acessar:
- **Events**: http://localhost:4200/events (requer autenticação)
- **Gallery**: http://localhost:4200/gallery (requer autenticação)

### 4. Páginas Públicas
- **Home**: http://localhost:4200/
- **About**: http://localhost:4200/about

## Status Atual

✅ **Backend**:
- API REST funcionando
- Autenticação JWT
- Endpoints de Auth (login, register, validate)
- Integração com NASA API
- Banco de dados SQL Server

✅ **Frontend**:
- Interface Angular moderna
- Autenticação funcional
- Guard de rotas
- Interceptor HTTP para JWT
- Páginas responsivas
- Imagens funcionando (usando URLs externas)

✅ **Integração**:
- CORS configurado
- HTTPS funcionando
- Registro e login funcionais
- Navegação com autenticação

## Próximos Passos

1. **Imagens**: Adicionar imagens locais se desejado
2. **Endpoints**: Implementar endpoints de eventos celestiais no backend
3. **Testes**: Adicionar testes unitários e de integração
4. **Deploy**: Configurar para produção

## Problemas Resolvidos

- ✅ CORS configurado entre frontend e backend
- ✅ Estrutura de DTOs alinhada entre frontend e backend
- ✅ Validação de senhas sincronizada
- ✅ Interceptor HTTP funcionando
- ✅ Imagens carregando (usando URLs externas como fallback)
- ✅ Registro e login funcionais