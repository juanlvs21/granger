<template>
  <div class="granger__profile-modal-container">
    <div class="modal-card" style="max-width: 500px">
      <header class="modal-card-head">
        <h2 class="is-size-5">Cambiar Contraseña</h2>
      </header>
      <form @submit.prevent="handleSubmit">
        <section class="modal-card-body">
          <b-field label="Contraseña Actual">
            <b-input
              v-model="changePassword.currentPassword"
              type="password"
              password-reveal
              required
            ></b-input>
          </b-field>
          <b-field label="Contraseña Nueva">
            <b-input v-model="changePassword.newPassword" type="password" password-reveal required></b-input>
          </b-field>
          <b-field label="Repetir Contraseña">
            <b-input
              v-model="changePassword.repeatPassword"
              type="password"
              password-reveal
              required
            ></b-input>
          </b-field>
          <!-- Error -->
          <Notification v-if="error" type="is-danger" :message="error" />
        </section>
        <footer class="modal-card-foot">
          <button class="button" type="button" @click="$parent.close()">Cancelar</button>
          <b-button type="is-primary" :loading="isLoading" native-type="submit">Guardar</b-button>
        </footer>
      </form>
      <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
    </div>
  </div>
</template>

<script>
// Components
import Notification from '~/components/core/Notification'

export default {
  name: 'Modal-Profile-Change-Password',
  components: {
    Notification
  },
  data() {
    return {
      changePassword: {
        currentPassword: '',
        newPassword: '',
        repeatPassword: ''
      },
      isLoading: false,
      error: null
    }
  },
  methods: {
    async handleSubmit() {
      this.isLoading = true
      this.error = null

      if (
        this.changePassword.newPassword != this.changePassword.repeatPassword
      ) {
        this.isLoading = false
        this.error = 'La contraseña no coincide'
        setTimeout(() => (this.error = null), 5000)
      } else {
        const data = {
          currentPassword: this.changePassword.currentPassword,
          newPassword: this.changePassword.newPassword
        }
        console.log(data)
        await this.$axios
          .$post(`${process.env.URL_SERVER}/api/user/change-password`, data, {
            headers: {
              authorization: this.$store.state.user.token
            }
          })
          .then(res => {
            this.$buefy.toast.open({
              duration: 3000,
              message: `Contraseña cambiada exitosamente`,
              position: 'is-bottom-right'
            })
            this.$parent.close()
          })
          .catch(err => {
            console.log(err.response.data.code)
            if (err.response.data.code === 'user/wrong-current-password') {
              this.error = err.response.data.message.es
              setTimeout(() => (this.error = null), 5000)
            }
          })
          .finally(() => (this.isLoading = false))
      }
    }
  }
}
</script>