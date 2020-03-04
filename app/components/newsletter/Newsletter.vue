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
          v-model="email"
        ></b-input>
        <p class="control">
          <button class="button is-info">Suscribirse</button>
        </p>
      </b-field>
    </form>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
  </div>
</template>

<script>
export default {
  name: 'Newsletter',
  data() {
    return {
      email: '',
      isLoading: false
    }
  },
  computed: {
    session() {
      return this.$store.state.user
    }
  },
  methods: {
    async handleSubmit() {
      this.isLoading = true

      await this.$axios
        .$post(
          `${process.env.URL_SERVER}/api/newsletter`,
          { email: this.email },
          {
            headers: {
              authorization: this.$store.state.user.token
            }
          }
        )
        .then(res => {
          console.log(res)
          this.email = ''
          this.$buefy.toast.open({
            duration: 3000,
            message: `¡Felicidades! Ahora podemos informarte periodicamente`,
            position: 'is-bottom-right'
          })
        })
        .catch(err => {
          console.log(err.response.data)
          let error = 'Error desconocido'
          if (
            err.response.data.code === 'newsletter/error-already-subscribed'
          ) {
            error = err.response.data.message.es
          }
          this.$buefy.toast.open({
            duration: 3000,
            type: 'is-danger',
            message: error,
            position: 'is-bottom-right'
          })
        })
        .finally(() => {
          this.isLoading = false
        })
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
