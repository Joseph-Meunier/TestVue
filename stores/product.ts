import { defineStore } from 'pinia'

interface Product {
  id: number
  name: string
  price: number
  stock: number
}

interface ProductState {
  products: Product[]
  loading: boolean
  error: string | null
}

export const useProductStore = defineStore('product', {
  // State (source de vérité unique)
  state: (): ProductState => ({
    products: [],
    loading: false,
    error: null
  }),

  // Getters (sélecteurs pour accéder au state)
  getters: {
    getProducts: (state) => state.products,
    getProductById: (state) => (id: number) => {
      return state.products.find(p => p.id === id)
    },
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null
  },

  // Actions (mutations synchrones et asynchrones)
  actions: {
    // Action pour charger les produits (SSR compatible)
    async fetchProducts() {
      this.loading = true
      this.error = null
      try {
        const products = await $fetch<Product[]>('/api/products')
        this.products = products
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Une erreur est survenue'
      } finally {
        this.loading = false
      }
    },

    // Action pour ajouter un produit
    async addProduct(product: Omit<Product, 'id'>) {
      this.loading = true
      this.error = null
      try {
        const newProduct = await $fetch<Product>('/api/products', {
          method: 'POST',
          body: product
        })
        this.products.push(newProduct)
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Erreur lors de l\'ajout'
      } finally {
        this.loading = false
      }
    },

    // Action pour mettre à jour le stock
    async updateStock(productId: number, newStock: number) {
      const product = this.products.find(p => p.id === productId)
      if (!product) return

      this.loading = true
      this.error = null
      try {
        await $fetch(`/api/products/${productId}`, {
          method: 'PATCH',
          body: { stock: newStock }
        })
        product.stock = newStock
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Erreur de mise à jour'
      } finally {
        this.loading = false
      }
    }
  }
})