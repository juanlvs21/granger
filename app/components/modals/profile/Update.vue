<template>
  <div class="granger__profile-modal-container">
    <div class="modal-card" style="max-width: 500px">
      <header class="modal-card-head">
        <h2 class="is-size-5">Actualizar Perfil</h2>
      </header>
      <form @submit.prevent="handleSubmit">
        <section class="modal-card-body">
          <b-field label="Nombre">
            <b-input v-model="profile.firstName" required></b-input>
          </b-field>
          <b-field label="Apellido">
            <b-input v-model="profile.lastName" required></b-input>
          </b-field>
          <b-field label="Correo Electrónico">
            <b-input type="email" v-model="profile.email" required></b-input>
          </b-field>
        </section>
        <footer class="modal-card-foot">
          <button class="button" type="button" @click="$parent.close()">Cancelar</button>
          <b-button type="is-primary" :loading="isLoading" native-type="submit">Actualizar</b-button>
        </footer>
      </form>
      <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal-Profile-Update',
  data() {
    return {
      profile: {
        firstName: this.$store.state.user.firstName,
        lastName: this.$store.state.user.lastName,
        email: this.$store.state.user.email
      },
      isLoading: false
    }
  },
  methods: {
    async handleSubmit() {
      this.isLoading = true
      await this.$axios
        .$put(`${process.env.URL_SERVER}/api/user`, this.profile, {
          headers: {
            authorization: this.$store.state.user.token
          }
        })
        .then(({ data }) => {
          this.$store.dispatch('logInAction', data)
          this.$cookies.set('token', data.token)

          this.$buefy.toast.open({
            duration: 3000,
            message: `Usuario actualizado exitosamente`,
            position: 'is-bottom-right'
          })
          this.$parent.close()
        })
        .catch(err => console.log(err))
        .finally(() => (this.isLoading = false))
    }
  }
}
</script>