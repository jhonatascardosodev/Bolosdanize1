const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Bolos da Nize API',
    description: 'API do site da confeitaria Bolos da Nize — produtos, imagens e autenticação admin.',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Desenvolvimento local',
    },
  ],
  tags: [
    { name: 'Sistema', description: 'Health check' },
    { name: 'Auth', description: 'Autenticação administrativa' },
    { name: 'Produtos', description: 'CRUD de bolos do cardápio' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token obtido em POST /api/auth/login',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Mensagem de erro' },
        },
      },
      Health: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'ok' },
          database: { type: 'string', example: 'sqlite' },
          products: { type: 'integer', example: 7 },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['password'],
        properties: {
          password: { type: 'string', example: 'admin123' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Bolo de Brigadeiro' },
          description: { type: 'string', example: 'Delicioso bolo de brigadeiro' },
          fullDescription: {
            type: 'string',
            example: 'Bolo macio recheado com brigadeiro cremoso.',
          },
          price: { type: 'number', example: 120 },
          image: {
            type: 'string',
            nullable: true,
            example: '/uploads/1234567890-foto.jpg',
          },
          category: {
            type: 'string',
            enum: ['cardapio', 'personalizado'],
            example: 'cardapio',
          },
          available: { type: 'boolean', example: true },
        },
      },
      ProductInput: {
        type: 'object',
        required: ['name', 'description', 'price'],
        properties: {
          name: { type: 'string', example: 'Bolo de Chocolate' },
          description: { type: 'string', example: 'Bolo cremoso de chocolate' },
          fullDescription: {
            type: 'string',
            example: 'Descrição completa do bolo.',
          },
          price: { type: 'number', example: 150 },
          category: {
            type: 'string',
            enum: ['cardapio', 'personalizado'],
            example: 'cardapio',
          },
          available: { type: 'boolean', example: true },
          image: {
            type: 'string',
            format: 'binary',
            description: 'Imagem do produto (JPG, PNG, WebP — máx. 2MB)',
          },
        },
      },
    },
  },
  paths: {
    '/api/health': {
      get: {
        tags: ['Sistema'],
        summary: 'Verificar status da API',
        responses: {
          200: {
            description: 'API funcionando',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Health' },
              },
            },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login administrativo',
        description: 'Retorna um token JWT válido por 7 dias.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Login realizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' },
              },
            },
          },
          401: {
            description: 'Senha incorreta',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/products': {
      get: {
        tags: ['Produtos'],
        summary: 'Listar produtos',
        parameters: [
          {
            name: 'available',
            in: 'query',
            description: 'Filtrar apenas produtos disponíveis',
            schema: { type: 'string', enum: ['true'] },
          },
        ],
        responses: {
          200: {
            description: 'Lista de produtos',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Product' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Produtos'],
        summary: 'Criar produto',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: { $ref: '#/components/schemas/ProductInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Produto criado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Product' },
              },
            },
          },
          400: {
            description: 'Dados inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          401: {
            description: 'Não autorizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/products/{id}': {
      get: {
        tags: ['Produtos'],
        summary: 'Buscar produto por ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'Produto encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Product' },
              },
            },
          },
          404: {
            description: 'Produto não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Produtos'],
        summary: 'Atualizar produto',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ProductInput' },
                  {
                    type: 'object',
                    properties: {
                      removeImage: {
                        type: 'string',
                        enum: ['true', 'false'],
                        description: 'Enviar "true" para remover a imagem atual',
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Produto atualizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Product' },
              },
            },
          },
          401: { description: 'Não autorizado' },
          404: { description: 'Produto não encontrado' },
        },
      },
      delete: {
        tags: ['Produtos'],
        summary: 'Excluir produto',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          204: { description: 'Produto excluído' },
          401: { description: 'Não autorizado' },
          404: { description: 'Produto não encontrado' },
        },
      },
    },
    '/api/products/{id}/toggle': {
      patch: {
        tags: ['Produtos'],
        summary: 'Alternar disponibilidade',
        description: 'Ativa ou desativa o produto no cardápio.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'Status alterado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Product' },
              },
            },
          },
          401: { description: 'Não autorizado' },
          404: { description: 'Produto não encontrado' },
        },
      },
    },
  },
}

export default swaggerSpec
