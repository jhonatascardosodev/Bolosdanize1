# 📦 Requisitos e Dependências - Bolos da Nize

## 🔧 Requisitos do Sistema

### 1. Node.js
- **Versão necessária**: ^20.19.0 ou >=22.12.0
- **Download**: https://nodejs.org/
- **Verificação**: Após instalar, execute no terminal:
  ```bash
  node --version
  npm --version
  ```

### 2. pnpm (Gerenciador de Pacotes)
- **Instalação**: Após instalar Node.js, execute:
  ```bash
  npm install -g pnpm
  ```
- **Verificação**:
  ```bash
  pnpm --version
  ```

## 📋 Dependências do Projeto

### Dependências Principais (Produção)
- **vue**: ^3.5.18 - Framework JavaScript
- **vuetify**: ^3.9.0-beta.1 - Biblioteca de componentes Material Design

### Dependências de Desenvolvimento
- **@mdi/font**: ^7.4.47 - Ícones Material Design
- **@tailwindcss/postcss**: ^4.1.12 - Plugin PostCSS do Tailwind
- **@vitejs/plugin-vue**: ^6.0.1 - Plugin Vue para Vite
- **autoprefixer**: ^10.4.21 - Plugin PostCSS
- **postcss**: ^8.5.6 - Processador CSS
- **tailwindcss**: ^4.1.12 - Framework CSS utilitário
- **vite**: ^7.0.6 - Build tool e dev server
- **vite-plugin-vue-devtools**: ^8.0.0 - DevTools para Vue

## 🚀 Instalação Passo a Passo

### Passo 1: Instalar Node.js
1. Acesse https://nodejs.org/
2. Baixe a versão LTS (Long Term Support)
3. Execute o instalador
4. Siga as instruções do instalador
5. Reinicie o terminal/PowerShell

### Passo 2: Instalar pnpm
Abra o terminal/PowerShell e execute:
```bash
npm install -g pnpm
```

### Passo 3: Instalar Dependências do Projeto
Navegue até a pasta do projeto e execute:
```bash
cd "C:\Users\jhona\OneDrive\Desktop\bolosite\Bolosdanize1"
pnpm install
```

### Passo 4: Executar o Projeto
```bash
pnpm dev
```

O servidor de desenvolvimento será iniciado e você poderá acessar o site no navegador (geralmente em http://localhost:5173)

## ✅ Verificação de Instalação

Execute os seguintes comandos para verificar se tudo está instalado:

```bash
# Verificar Node.js
node --version
# Deve mostrar: v20.x.x ou v22.x.x

# Verificar npm (vem com Node.js)
npm --version
# Deve mostrar: 10.x.x ou superior

# Verificar pnpm
pnpm --version
# Deve mostrar: 9.x.x ou superior
```

## 🔍 Troubleshooting

### Problema: Comandos não reconhecidos
**Solução**: 
- Certifique-se de reiniciar o terminal após instalar Node.js
- Verifique se o Node.js foi adicionado ao PATH do sistema
- No Windows, pode ser necessário reiniciar o computador

### Problema: Erro ao instalar dependências
**Solução**:
- Verifique se está na pasta correta do projeto
- Tente limpar o cache: `pnpm store prune`
- Delete a pasta `node_modules` (se existir) e execute `pnpm install` novamente

### Problema: Porta já em uso
**Solução**:
- O Vite tentará usar a porta 5173 por padrão
- Se estiver em uso, ele sugerirá outra porta automaticamente

## 📝 Comandos Úteis

```bash
# Instalar dependências
pnpm install

# Executar em modo desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Preview da build de produção
pnpm preview
```

## 🌐 URLs e Recursos

- **Node.js**: https://nodejs.org/
- **pnpm**: https://pnpm.io/
- **Vue.js**: https://vuejs.org/
- **Vuetify**: https://vuetifyjs.com/
- **Vite**: https://vitejs.dev/
- **TailwindCSS**: https://tailwindcss.com/
