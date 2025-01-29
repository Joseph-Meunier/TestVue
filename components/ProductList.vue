<template>
    <div>
      <h2>Produits</h2>
      
      <!-- Gestion des états de chargement et d'erreur -->
      <div v-if="loading" class="loading">
        Chargement...
      </div>
      
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      
      <!-- Liste des produits -->
      <div v-else class="products-grid">
        <div v-for="product in products" :key="product.id" class="product-card">
          <h3>{{ product.name }}</h3>
          <p>Prix: {{ product.price }}€</p>
          <div class="stock-control">
            <span :class="{ 'low-stock': product.stock < 10 }">
              Stock: {{ product.stock }}
            </span>
            <div class="stock-buttons">
              <button @click="updateStock(product.id, product.stock - 1)"
                      :disabled="product.stock <= 0">
                -
              </button>
              <button @click="updateStock(product.id, product.stock + 1)">
                +
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Formulaire d'ajout -->
      <form @submit.prevent="handleSubmit" class="add-product-form">
        <input v-model="newProduct.name" placeholder="Nom du produit" required>
        <input v-model.number="newProduct.price" type="number" placeholder="Prix" required>
        <input v-model.number="newProduct.stock" type="number" placeholder="Stock initial" required>
        <button type="submit">Ajouter</button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useProductStore } from '~/stores/product'
  import { storeToRefs } from 'pinia'
  
  // Initialisation du store
  const store = useProductStore()
  
  // Destructuration réactive des états du store
  const { products, loading, error } = storeToRefs(store)
  
  // État local pour le nouveau produit
  const newProduct = ref({
    name: '',
    price: 0,
    stock: 0
  })
  
  // Méthodes
  const handleSubmit = async () => {
    await store.addProduct(newProduct.value)
    newProduct.value = { name: '', price: 0, stock: 0 }
  }
  
  const updateStock = (productId: number, newStock: number) => {
    if (newStock >= 0) {
      store.updateStock(productId, newStock)
    }
  }
  
  // Chargement initial des données (important pour le SSR)
  // Cette fonction sera exécutée côté serveur lors du SSR
  if (process.server) {
    await store.fetchProducts()
  }
  </script>
  
  <style scoped>
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    padding: 20px;
  }
  
  .product-card {
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 8px;
  }
  
  .stock-control {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }
  
  .low-stock {
    color: red;
  }
  
  .stock-buttons button {
    margin: 0 5px;
    padding: 5px 10px;
  }
  
  .loading, .error {
    text-align: center;
    padding: 20px;
  }
  
  .error {
    color: red;
  }
  
  .add-product-form {
    display: grid;
    gap: 10px;
    max-width: 400px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  
  input {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  button {
    padding: 8px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  </style>