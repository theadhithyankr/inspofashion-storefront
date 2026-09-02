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
      const lineTotal = (item.quantity * item.price).toFixed(2)
      const unitPrice = item.price.toFixed(2)
      const sku = item.sku ? `\n   SKU: ${item.sku}` : ''
      const color = item.color ? `\n   Color: ${item.color}` : ''
      const size = item.size ? `\n   Size: ${item.size}` : ''
      const pricing = `\n   Unit Price: Rs. ${unitPrice}\n   Line Total: Rs. ${lineTotal}`
      
      return `${index + 1}. ${item.title}${color}${size}${sku}\n   Qty: ${item.quantity}${pricing}`
    })
    .join('\n\n')

  // Compute total from items to ensure exact match with cart subtotal (sum of item.price * item.quantity)
  const calculatedTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)

  return `New order request\n\nCustomer details:\nName: ${customerData.name.trim()}\nPhone: ${normalizePhoneNumber(customerData.phone)}\nAddress: ${customerData.address.trim()}, ${customerData.city.trim()}, ${customerData.state.trim()} - ${customerData.pincode.trim()}\n\nOrder items:\n${itemsText}\n\nTotal amount: Rs. ${calculatedTotal}`
}

export function generateWhatsAppUrl(phoneNumber, message) {
  const phone = normalizePhoneNumber(phoneNumber)
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
