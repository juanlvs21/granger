<template>
  <div class="granger__genres-modal-container">
    <div class="modal-card" style="max-width: 500px">
      <header class="modal-card-head">
        <h2 class="is-size-5">Género - Editar: {{selectedGenre.genre}}</h2>
      </header>

      <!-- Form -->
      <Form
        titleButton="Editar"
        :genre="genre"
        :isLoading="isLoading"
        :error="error"
        :handleSubmit="handleSubmit"
        :handleClose="handleClose"
      >
        <b-field>
          <b-input placeholder="Género" v-model="genre.genre"></b-input>
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
  name: 'Modal-Genres-Edit',
  props: ['handleGetAllGenres', 'selectedGenre'],
  components: {
    Form
  },
  data() {
    return {
      genre: {
        _id: this.selectedGenre._id,
        genre: this.selectedGenre.genre
      },
      isLoading: false,
      error: null
    }
  },
  methods: {
    async handleSubmit() {
      this.isLoading = true

      if (this.genre.genre.trim() === '') {
        this.isLoading = false
        this.error = 'El campo está vacio'
        setTimeout(() => (this.error = null), 5000)
      } else {
        await this.$axios
          .$put(`${process.env.URL_SERVER}/api/genres`, this.genre, {
            headers: {
              authorization: this.$store.state.user.token
            }
          })
          .then(res => {
            console.log(res)
            this.$buefy.toast.open({
              duration: 3000,
              message: `Género actualizado exitosamente`,
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