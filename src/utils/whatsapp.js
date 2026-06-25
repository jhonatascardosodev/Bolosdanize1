import { DELIVERY_FEE } from '@/constants/business.js'

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '5592991985973'

function formatCurrency(value) {
  return `R$ ${Number(value).toFixed(2).replace('.', ',')}`
}

function formatDateTime() {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date())
}

export function buildOrderMessage(cartItems, customer = {}) {
  const { name, phone, address, notes } = customer

  let message = '🍰 *NOVO PEDIDO — BOLOS DA NIZE*\n\n'

  if (name?.trim()) {
    message += `👤 *Cliente:* ${name.trim()}\n`
  }

  if (phone?.trim()) {
    message += `📱 *Telefone:* ${phone.trim()}\n`
  }

  if (address?.trim()) {
    message += `📍 *Endereço:* ${address.trim()}\n`
  }

  message += '\n*━━━ ITENS DO PEDIDO ━━━*\n\n'

  cartItems.forEach((item, index) => {
    const lineTotal = item.price * item.quantity

    message += `*${index + 1}. ${item.name}*\n`

    if (item.size) {
      message += `   Tamanho: ${item.size}\n`
    }

    if (item.flavors?.length) {
      message += `   Sabores: ${item.flavors.join(' + ')}\n`
    }

    if (item.birthdayName) {
      message += `   Nome no bolo: ${item.birthdayName}\n`
    }

    if (item.birthdayAge) {
      message += `   Idade: ${item.birthdayAge} anos\n`
    }

    if (item.cakeTheme) {
      message += `   Tema: ${item.cakeTheme}\n`
    }

    if (item.birthdayName || item.birthdayAge || item.cakeTheme) {
      message += `   Topper: incluso\n`
    }

    message += `   Qtd: ${item.quantity} × ${formatCurrency(item.price)}\n`
    message += `   Subtotal: *${formatCurrency(lineTotal)}*\n\n`
  })

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + DELIVERY_FEE

  message += '*━━━ RESUMO ━━━*\n'
  message += `Subtotal: ${formatCurrency(subtotal)}\n`
  message += `Taxa de entrega: ${formatCurrency(DELIVERY_FEE)}\n`
  message += `*TOTAL: ${formatCurrency(total)}*\n`

  if (notes?.trim()) {
    message += `\n📝 *Observações:*\n${notes.trim()}\n`
  }

  message += `\n_Pedido enviado pelo site em ${formatDateTime()}_`
  message += '\n\nAguardo confirmação do pedido. Obrigado(a)! 😊'

  return message
}

export function openWhatsAppOrder(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  if (isMobile) {
    window.location.href = url
    return
  }

  window.open(url, '_blank', 'noopener,noreferrer')
}

export { WHATSAPP_NUMBER, DELIVERY_FEE }
