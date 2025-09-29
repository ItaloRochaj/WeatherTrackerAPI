# AstronomyTracker

Um frontend Angular moderno para explorar os mistérios do cosmos, baseado no tema escuro e visual das imagens fornecidas.

## 🌟 Características

- **Design Tema Escuro**: Interface elegante inspirada no cosmos
- **Responsivo**: Funciona perfeitamente em todos os dispositivos
- **NASA APOD**: Astronomy Picture of the Day integrado
- **Eventos Celestiais**: Calendário de eventos astronômicos
- **Galeria Histórica**: Arquivo pesquisável de imagens e dados
- **Navegação Intuitiva**: UX/UI moderna e acessível

## 🚀 Tecnologias

- **Angular 19.1.5**: Framework principal
- **TypeScript**: Linguagem de programação
- **SCSS**: Estilização avançada
- **Node.js 20**: Runtime
- **npm 11.5.2**: Gerenciador de pacotes

## 📦 Estrutura do Projeto

```
src/
├── app/
│   ├── components/           # Componentes reutilizáveis
│   │   ├── navbar/          # Barra de navegação
│   │   ├── hero/            # Seção hero da home
│   │   ├── astronomy-today/ # Card da imagem do dia
│   │   ├── celestial-events/# Lista de eventos
│   │   └── historical-data/ # Seção de dados históricos
│   ├── pages/               # Páginas da aplicação
│   │   ├── home/            # Página inicial
│   │   ├── events/          # Página de eventos
│   │   ├── gallery/         # Galeria de imagens
│   │   └── about/           # Sobre o projeto
│   ├── services/            # Services para API
│   │   └── astronomy.service.ts
│   └── models/              # Interfaces TypeScript
│       └── astronomy.ts
└── assets/                  # Recursos estáticos
    └── images/              # Imagens da aplicação
```

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 20
- npm 11.5.2
- Angular CLI 19.1.5

### Passos para executar

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd astronomy-tracker
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o servidor de desenvolvimento**
   ```bash
   ng serve
   ```

4. **Acesse no navegador**
   ```
   http://localhost:4200
   ```

## 📡 Integração com Backend

O frontend está preparado para consumir a API **WeatherTrackerAPI** com os seguintes endpoints:

### Endpoints Esperados

- `GET /api/apod` - NASA Astronomy Picture of the Day
- `GET /api/events/upcoming` - Próximos eventos celestiais
- `GET /api/historical` - Dados históricos com busca

### Configuração da API

No arquivo `src/app/services/astronomy.service.ts`, altere a URL base:

```typescript
private apiUrl = 'http://localhost:5000/api'; // Altere para sua API
```

## 🎨 Componentes Principais

### Navbar
- Logo responsivo com telescópio emoji
- Links de navegação (Home, Events, Gallery, About)
- Busca overlay com animações
- Menu mobile hamburger

### Hero Section
- Título "Explore the Cosmos" com gradiente
- Seletor de data opcional
- Botão "View Today's Astronomy"
- Fundo animado com estrelas

### Astronomy Today
- Imagem do dia da NASA
- Overlay com botão "View Full Image"
- Título, data e descrição
- Tratamento de erro e loading

### Celestial Events
- Cards de eventos com badges coloridos
- Meteor Shower, Lunar Eclipse, Planetary Alignment
- Informações de data e visibilidade
- Grid responsivo

### Historical Data
- Animação cósmica com espiral rotativa
- Call-to-action para busca no arquivo
- Efeitos visuais de estrelas piscando

## 🎭 Temas e Cores

### Paleta de Cores
- **Primary Blue**: `#4a90e2`
- **Background Dark**: `#0a0e1a` → `#2d3561`
- **Text Light**: `#ffffff`
- **Text Secondary**: `#b8c5d6`
- **Accent Colors**: Gradientes azuis e roxos

### Componentes UI
- **Botões**: Bordas arredondadas com gradientes
- **Cards**: Backdrop blur e bordas transparentes
- **Inputs**: Estilo glassmorphism
- **Animações**: Hover effects e transições suaves

## 📱 Responsividade

O design é totalmente responsivo com breakpoints:

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
ng serve

# Build de produção
ng build --prod

# Testes unitários
ng test

# Lint
ng lint

# Gerar componente
ng generate component nome-componente

# Gerar service
ng generate service nome-service
```

## 🌐 Deploy

### Build para produção
```bash
ng build --configuration production
```

Os arquivos serão gerados na pasta `dist/astronomy-tracker/`.

### Variáveis de Ambiente

Crie arquivos de ambiente para diferentes ambientes:

```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://sua-api-production.com/api'
};
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- **NASA**: APIs de dados astronômicos
- **Angular Team**: Framework excepcional
- **Comunidade Open Source**: Inspiração e ferramentas

## 📞 Contato

Para dúvidas ou sugestões, entre em contato:

- Email: dev@astronomytracker.com
- GitHub Issues: Use as issues do repositório

---

**AstronomyTracker** - Explore o cosmos com estilo! ✨🔭
