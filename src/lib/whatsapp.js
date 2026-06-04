import { normalizePhoneNumber } from './format'

export function validateCheckout(customer) {
  const errors = {}
  const phone = normalizePhoneNumber(customer.phone)

  if (!customer.name?.trim()) errors.name = 'Enter your full name.'
  if (phone.length < 10) errors.phone = 'Enter a valid phone number.'
  if (!customer.address?.trim()) errors.address = 'Enter your delivery address.'
  if (!customer.city?.trim()) errors.city = 'Enter your city.'
  if (!customer.state?.trim()) errors.state = 'Enter your state.'
  if (!/^\d{6}$/.test(customer.pincode || '')) errors.pincode = 'Enter a valid 6 digit PIN code.'

  return errors
}

export function formatCartMessage(cartItems, totalPrice, customerData) {
  if (!cartItems?.length) return ''

  const itemsText = cartItems
    .map((item, index) => {
      const color = item.color ? `, Color: ${item.color}` : ''
      const image = item.imageUrl ? `\n   Image: ${item.imageUrl}` : ''
      return `${index + 1}. ${item.quantity}x ${item.title} (Size: ${item.size}${color}, Rs. ${item.price.toFixed(2)} each)${image}`
    })
    .join('\n\n')

  return `New order request\n\nCustomer details:\nName: ${customerData.name.trim()}\nPhone: ${normalizePhoneNumber(customerData.phone)}\nAddress: ${customerData.address.trim()}, ${customerData.city.trim()}, ${customerData.state.trim()} - ${customerData.pincode.trim()}\n\nOrder items:\n${itemsText}\n\nTotal amount: Rs. ${totalPrice.toFixed(0)}`
}

export function generateWhatsAppUrl(phoneNumber, message) {
  const phone = normalizePhoneNumber(phoneNumber)
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
