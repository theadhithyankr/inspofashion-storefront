export function formatCartMessage(cartItems, totalPrice, customerData) {
  if (!cartItems || cartItems.length === 0) {
    return ''
  }

  const itemsText = cartItems
    .map((item, index) => {
      const colorStr = item.color ? ` ${item.color},` : ''
      let text = `${index + 1}. ${item.quantity}x ${item.title} (Size: ${item.size},${colorStr} ₹${(item.price).toFixed(2)} each)`
      if (item.imageUrl) {
        text += `\n   Image: ${item.imageUrl}`
      }
      return text
    })
    .join('\n\n')

  return `*New Order Request!*\n\n*Customer Details:*\nName: ${customerData.name}\nPhone: ${customerData.phone}\nAddress: ${customerData.address}, ${customerData.city}, ${customerData.state} - ${customerData.pincode}\n\n*Order Items:*\n${itemsText}\n\n*Total Amount:* ₹${totalPrice.toFixed(0)}`
}

export function generateWhatsAppUrl(phoneNumber, message) {
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
}

export function redirectToWhatsApp(cartItems, totalPrice, phoneNumber, customerData) {
  if (!cartItems || cartItems.length === 0) {
    alert('Your cart is empty!')
    return
  }

  const message = formatCartMessage(cartItems, totalPrice, customerData)
  const url = generateWhatsAppUrl(phoneNumber, message)

  window.open(url, '_blank')
}
