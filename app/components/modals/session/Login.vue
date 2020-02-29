<template>
  <form @submit.prevent="handleSubmit">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Iniciar Sesión</p>
      </header>
      <section class="modal-card-body">
        <b-field label="Correo electrónico">
          <b-input type="email" v-model="user.email" placeholder="ejemplo@email.com" required></b-input>
        </b-field>

        <b-field label="Contraseña">
          <b-input
            type="password"
            v-model="user.password"
            password-reveal
            placeholder="********"
            required
          ></b-input>
        </b-field>

        <!-- Error -->
        <Notification v-if="error" type="is-danger" :message="error" />
      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">Cerrar</button>
        <button class="button is-primary">Entrar</button>
      </footer>
    </div>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
  </form>
</template>

<script>
// Components
import Notification from '~/components/core/Notification'

export default {
  name: 'Modal-Session-Login',
  data() {
    return {
      user: {
        email: '',
        password: ''
      },
      isLoading: false,
      error: null
    }
  },
  components: {
    Notification
  },
  methods: {
    async handleSubmit() {
      this.isLoading = true

      await this.$axios
        .$post(`${process.env.URL_SERVER}/api/auth/signin`, this.user)
        .then(({ data }) => {
          this.$store.dispatch('logInAction', data.user)
          this.$store.dispatch('setFavoritesAction', data.favorites)
          this.$cookies.set('token', data.user.token)
          this.$parent.close()
          if (this.$route.path === '/auth/signup') {
            this.$router.replace('/')
          }
        })
        .catch(err => {
          console.log(err.response.data)
          if (err.response.data.code === 'auth/wrong-email-or-password') {
            this.error = err.response.data.message.es
            setTimeout(() => (this.error = null), 5000)
          } else if (err.response.data.code === 'validator/wrong-fields') {
            this.error = err.response.data.data
            setTimeout(() => (this.error = null), 5000)
          } else {
            this.error = 'Error desconocido'
            setTimeout(() => (this.error = null), 5000)
          }
        })
        .finally(() => (this.isLoading = false))
    }
  }
}
</script>
