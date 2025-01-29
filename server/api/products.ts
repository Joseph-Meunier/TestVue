import { defineEventHandler, readBody } from 'h3'

let products = [
  { id: 1, name: 'Produit A', price: 29.99, stock: 15 },
  { id: 2, name: 'Produit B', price: 49.99, stock: 8 },
]

export default defineEventHandler(async (event) => {
  const method = event.method
  const url = event.path

  // GET /api/products
  if (method === 'GET' && url === '/api/products') {
    return products
  }

  // POST /api/products
  if (method === 'POST' && url === '/api/products') {
    const body = await readBody(event)
    const newProduct = {
      id: products.length + 1,
      ...body
    }
    products.push(newProduct)
    return newProduct
  }

  // PATCH /api/products/:id
  if (method === 'PATCH' && url.startsWith('/api/products/')) {
    const id = parseInt(url.split('/').pop() || '')
    const body = await readBody(event)
    const productIndex = products.findIndex(p => p.id === id)
    
    if (productIndex !== -1) {
      products[productIndex] = { ...products[productIndex], ...body }
      return products[productIndex]
    }
  }

  throw new Error('Route non trouvée')
})