const SITE_NAME = 'Bolos da Nize'
const DEFAULT_DESCRIPTION =
  'Bolos artesanais e personalizados em Itacoatiara - AM. Encomende pelo site ou WhatsApp.'

const pageMeta = {
  Home: {
    title: 'Bolos artesanais em Itacoatiara',
    description:
      'Confeitaria artesanal Bolos da Nize. Bolos personalizados, cardápio completo e entrega em Itacoatiara - AM.',
  },
  Sobre: {
    title: 'Sobre nós',
    description: 'Conheça a história da Bolos da Nize, confeitaria artesanal em Itacoatiara desde 2020.',
  },
  Bolos: {
    title: 'Bolos personalizados',
    description: 'Monte seu bolo personalizado: escolha tamanho, sabores e topper. Bolos da Nize.',
  },
  Cardapio: {
    title: 'Cardápio',
    description: 'Veja nosso cardápio de bolos artesanais. Peça online e finalize pelo WhatsApp.',
  },
  Contato: {
    title: 'Contato',
    description: 'Fale com a Bolos da Nize pelo WhatsApp ou Instagram. Itacoatiara - AM.',
  },
  ClienteCadastro: {
    title: 'Cadastro',
    description: 'Cadastre-se no programa de fidelidade Bolos da Nize e ganhe pontos de desconto.',
  },
  ClienteLogin: {
    title: 'Login',
    description: 'Entre na sua conta Bolos da Nize e acompanhe seus pontos.',
  },
  ClienteConta: {
    title: 'Minha conta',
    description: 'Veja seus pontos, histórico e benefícios no programa de fidelidade.',
  },
}

function setMetaTag(attribute, key, content) {
  let element = document.querySelector(`meta[${attribute}="${key}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

export function updatePageMeta(routeName) {
  const meta = pageMeta[routeName] || {}
  const title = meta.title ? `${meta.title} | ${SITE_NAME}` : SITE_NAME
  const description = meta.description || DEFAULT_DESCRIPTION

  document.title = title
  setMetaTag('name', 'description', description)
  setMetaTag('property', 'og:title', title)
  setMetaTag('property', 'og:description', description)
  setMetaTag('property', 'og:type', 'website')
  setMetaTag('name', 'twitter:card', 'summary_large_image')
  setMetaTag('name', 'twitter:title', title)
  setMetaTag('name', 'twitter:description', description)
}
