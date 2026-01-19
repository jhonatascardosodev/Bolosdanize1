# 🎂 Bolos da Nize - Site da Confeitaria

Site profissional da confeitaria **Bolos da Nize** localizada em Itacoatiara - AM. Desenvolvido com Vue.js 3, Vuetify e TailwindCSS.

## ✨ Funcionalidades

### 🏠 **Páginas Principais**
- **Hero Section**: Logo e apresentação da confeitaria
- **Sobre**: História e estatísticas da empresa
- **Bolos Personalizados**: Sistema de seleção de tamanhos e sabores
- **Cardápio**: Catálogo completo de bolos com filtros
- **Contato**: Informações de contato e redes sociais

### 🛒 **Sistema de Carrinho**
- **Seleção de Sabores**: Modal para escolher até 2 sabores (pode repetir)
- **Carrinho Interativo**: Adicionar, remover e alterar quantidades
- **Integração WhatsApp**: Finalizar pedidos diretamente via WhatsApp
- **Feedback Visual**: Animações e notificações

### 🎨 **Design Responsivo**
- **Mobile First**: Totalmente adaptável para dispositivos móveis
- **Paleta de Cores**: Rosa e verde oliva da marca
- **Tipografia**: Playfair Display e Poppins
- **Animações**: Transições suaves e hover effects

## 🚀 Tecnologias Utilizadas

- **Vue.js 3** - Framework JavaScript
- **Vuetify 3** - Biblioteca de componentes Material Design
- **TailwindCSS 4** - Framework CSS utilitário
- **Vite** - Build tool e dev server
- **Material Design Icons** - Ícones

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js (versão 20.19.0 ou superior)
- pnpm (gerenciador de pacotes)

### Instalação
```bash
# Instalar dependências
pnpm install

# Executar em modo desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Preview da build
pnpm preview
```

## 🎯 Funcionalidades Específicas

### Bolos Personalizados
- **4 Tamanhos**: 18cm, 20cm, 23cm, 27cm
- **7 Sabores**: Brigadeiro, Beijinho, Doce de leite, Leite ninho, Mousse de Cupuaçu, Mousse de Maracujá, Três leites
- **Seleção Flexível**: Escolha 2 sabores diferentes ou 1 sabor duplicado
- **Preços**: R$ 110,00 a R$ 200,00

### Sistema de Carrinho
- **Hover Effects**: Overlay nos cards de bolos
- **Modal de Sabores**: Interface intuitiva para seleção
- **Carrinho Lateral**: Drawer com gestão completa de itens
- **WhatsApp Integration**: Mensagem formatada com pedido completo

## 📱 Responsividade

- **Desktop**: Layout completo com sidebar e navegação horizontal
- **Tablet**: Adaptação automática de grids e espaçamentos
- **Mobile**: Menu hambúrguer e layout empilhado

## 🎨 Identidade Visual

### Cores
- **Rosa Principal**: #D4A5A5
- **Rosa Claro**: #E8B4B8
- **Verde Oliva**: #9CAF88
- **Fundo Suave**: #FDF2F8

### Tipografia
- **Títulos**: Playfair Display (serif)
- **Corpo**: Poppins (sans-serif)

## 📞 Contato

- **WhatsApp**: (92) 99198-5973
- **Instagram**: [@bolosdanizeoficial](https://www.instagram.com/bolosdanizeoficial)
- **Localização**: Itacoatiara - AM
- **Horário**: Seg-Sex 8h-18h, Sáb 8h-14h

## 📈 Estatísticas

- **Fundação**: 2020
- **Experiência**: 5+ anos
- **Bolos Produzidos**: 500+
- **Tipo**: 100% Artesanal

## 🛠️ Desenvolvimento

### Estrutura do Projeto
```
src/
├── components/                    # Componentes Vue
│   ├── HeroSection.vue           # Seção inicial/hero
│   ├── SobreSection.vue          # Seção sobre a empresa
│   ├── BolosPersonalizadosSection.vue  # Seção de bolos personalizados
│   ├── CardapioSection.vue       # Catálogo de bolos
│   ├── ContatoSection.vue        # Informações de contato
│   └── CarrinhoDrawer.vue        # Drawer do carrinho de compras
├── plugins/                      # Configurações
│   └── vuetify.js                # Configuração do Vuetify
├── style.css                     # Estilos globais com Tailwind
├── App.vue                       # Componente principal
└── main.js                       # Ponto de entrada da aplicação
```

### Scripts Disponíveis
- `pnpm dev` - Servidor de desenvolvimento
- `pnpm build` - Build para produção
- `pnpm preview` - Preview da build

## 📄 Licença

Este projeto é propriedade da **Bolos da Nize** - Confeitaria Artesanal.

---

*Desenvolvido com ❤️ para a confeitaria Bolos da Nize*