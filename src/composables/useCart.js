import { ref } from 'vue'

const cart = ref([])

export function useCart() {
  const addToCart = (item) => {
    const existingItem = cart.value.find(cartItem => 
      cartItem.id === item.id && 
      JSON.stringify(cartItem.flavors) === JSON.stringify(item.flavors)
    )

    if (existingItem) {
      existingItem.quantity += item.quantity
    } else {
      cart.value.push({ ...item })
    }
  }

  const removeFromCart = (index) => {
    cart.value.splice(index, 1)
  }

  const cartItemCount = () => {
    return cart.value.reduce((total, item) => total + item.quantity, 0)
  }

  return {
    cart,
    addToCart,
    removeFromCart,
    cartItemCount,
  }
}
