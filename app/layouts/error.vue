<template>
  <div class="granger__error-container">
    <div class="container has-text-centered granger__book-not-found">
      <!-- Error -->
      <img src="/images/book-not-found.webp" alt="Book not found" />
      <h1 class="is-size-1">¡OOPS!</h1>
      <h1 v-if="error.statusCode === 404 " class="is-size-2">Página no encontrada</h1>
      <h1 v-else class="is-size-2">Lo sentimos, ha ocurrido un error</h1>

      <div class="granger__book-not-found-btn-container">
        <b-button tag="nuxt-link" to="/" type="is-info">Ir al inicio</b-button>
        <b-button tag="nuxt-link" to="/books" type="is-primary">Ver todos los libros</b-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error-Layout',
  props: ['error'],
  transition: 'fade',
  head() {
    return {
      title: 'Error | Granger'
    }
  },
  mounted() {
    console.log(this.error)
  }
}
</script>

<style scoped lang="scss">
.granger__error-container {
  height: calc(100vh - 112px);
  overflow-y: auto;
  padding-top: 10%;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .granger__error-container {
    height: calc(100vh - 132px);
  }
}
</style>