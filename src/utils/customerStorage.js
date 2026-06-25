import { STORAGE_KEYS } from '@/constants'

const EMPTY = {
  name: '',
  phone: '',
  address: '',
  notes: '',
}

export function loadCustomer() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMER)
    if (!saved) return { ...EMPTY }

    return { ...EMPTY, ...JSON.parse(saved) }
  } catch {
    return { ...EMPTY }
  }
}

export function saveCustomer(customer) {
  localStorage.setItem(
    STORAGE_KEYS.CUSTOMER,
    JSON.stringify({
      name: customer.name?.trim() || '',
      phone: customer.phone?.trim() || '',
      address: customer.address?.trim() || '',
      notes: customer.notes?.trim() || '',
    })
  )
}
