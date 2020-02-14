<template>
  <div class="granger__newsletter-container has-text-white">
    <div class="granger__newsletter-icon">
      <i class="fas fa-envelope"></i>
    </div>
    <h1 class="is-size-3">Suscríbase a nuestro boletín</h1>
    <p>Manténgase actualizado con nuestras últimas novedades y productos.</p>
    <form @submit.prevent="handleSubmit">
      <b-field>
        <b-input
          placeholder="Dirección de correo electrónico"
          type="email"
          icon="email"
        >
        </b-input>
        <p class="control">
          <button class="button is-info">Suscribirse</button>
        </p>
      </b-field>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Home-Newsletter',
  methods: {
    handleSubmit() {
      alert('Suscribiendo')
    }
  }
}
</script>

<style scoped lang="scss">
.granger__newsletter-container {
  width: 100%;
  height: 250px;
  background-color: var(--primary);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 80px;
  position: relative;
  border-top: 4px solid var(--info);
  border-bottom: 4px solid #fff;
  padding: 20px;

  .granger__newsletter-icon {
    position: absolute;
    top: -50px;
    width: 100px;
    height: 100px;
    background-color: #fff;
    border-radius: 100px;
    border: 4px solid var(--info);
    display: flex;
    justify-content: center;
    align-items: center;

    i {
      color: var(--info);
      font-size: 50px;
    }
  }

  form {
    margin-top: 20px;
  }
}

@media (max-width: 450px) {
  .granger__newsletter-container {
    height: 300px;
  }
}
</style>
