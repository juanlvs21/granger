<template>
  <div class="granger__genres-modal-container">
    <div class="modal-card" style="max-width: 500px">
      <header class="modal-card-head">
        <h2 class="is-size-5">Género - Nuevo</h2>
      </header>

      <!-- Form -->
      <Form
        titleButton="Agregar"
        :genre="genre"
        :isLoading="isLoading"
        :error="error"
        :handleSubmit="handleSubmit"
        :handleClose="handleClose"
      >
        <b-field>
          <b-input placeholder="Género" v-model="genre"></b-input>
        </b-field>
      </Form>

      <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
    </div>
  </div>
</template>

<script>
// Components
import Form from '~/components/modals/genres/Form'

export default {
  name: 'Modal-Genres-Add',
  props: ['handleGetAllGenres'],
  components: {
    Form
  },
  data() {
    return {
      genre: '',
      isLoading: false,
      error: null
    }
  },
  methods: {
    async handleSubmit() {
      this.isLoading = true

      if (this.genre.trim() === '') {
        this.isLoading = false
        this.error = 'El campo está vacio'
        setTimeout(() => (this.error = null), 5000)
      } else {
        await this.$axios
          .$post(
            `${process.env.URL_SERVER}/api/genres`,
            { genre: this.genre },
            {
              headers: {
                authorization: this.$store.state.user.token
              }
            }
          )
          .then(res => {
            this.genre = ''
            this.$buefy.toast.open({
              duration: 3000,
              message: `Género agregado exitosamente`,
              position: 'is-bottom-right'
            })
            this.handleGetAllGenres()
            this.$parent.close()
          })
          .catch(err => console.log(err))
          .finally(() => (this.isLoading = false))
      }
    },
    handleClose() {
      this.$parent.close()
    }
  }
}
</script>