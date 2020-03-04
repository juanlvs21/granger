<template>
  <div class="granger__update-files-modal-container">
    <div class="modal-card" style="max-width: 500px">
      <header class="modal-card-head">
        <h2 class="is-size-5">Actualizar archivos</h2>
      </header>
      <form @submit.prevent="handleSubmit">
        <section class="modal-card-body">
          <div class="columns">
            <div class="column">
              <b-field class="file">
                <b-upload v-model="files.pdf" required>
                  <a class="button is-primary">
                    <b-icon icon="upload"></b-icon>
                    <span>Libro (PDF)</span>
                  </a>
                </b-upload>
                <span class="file-name" v-if="files.pdf">{{ files.pdf.name }}</span>
              </b-field>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <b-field class="file">
                <b-upload v-model="files.cover" required>
                  <a class="button is-primary">
                    <b-icon icon="upload"></b-icon>
                    <span>Portada</span>
                  </a>
                </b-upload>
                <span class="file-name" v-if="files.cover">{{ files.cover.name }}</span>
              </b-field>
            </div>
          </div>
          <!-- Error -->
          <div class="columns">
            <div class="column">
              <Notification v-if="error" type="is-danger" :message="error" />
            </div>
          </div>
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
// Components
import Notification from '~/components/core/Notification'

export default {
  name: 'Modal-Book-Update-Files',
  props: ['book_uuid', 'handleGetBook'],
  components: {
    Notification
  },
  data() {
    return {
      files: {
        pdf: null,
        cover: null
      },
      isLoading: false,
      error: null
    }
  },
  methods: {
    async handleSubmit() {
      this.isLoading = true

      const formData = new FormData()
      formData.append('cover', this.files.cover)
      formData.append('pdf', this.files.pdf)

      await this.$axios
        .$put(
          `${process.env.URL_SERVER}/api/books/files/${this.book_uuid}`,
          formData,
          {
            headers: {
              authorization: this.$store.state.user.token
            }
          }
        )
        .then(res => {
          this.$buefy.toast.open({
            duration: 3000,
            message: 'Archivos actualizados satisfactoriamente',
            position: 'is-bottom-right'
          })
          this.handleGetBook()
          this.$parent.close()
        })
        .catch(err => {
          if (
            err.response.data.code === 'auth/authentication-required' ||
            err.response.data.code === 'auth/required-permissions' ||
            err.response.data.code === 'books/books/not-found' ||
            err.response.data.code === 'books/cover-pdf-is-required' ||
            err.response.data.code === 'books/cover-is-required' ||
            err.response.data.code === 'books/cover-must-be-jpg-jpeg-png' ||
            err.response.data.code === 'books/book-must-be-pdf' ||
            err.response.data.code === 'books/pdf-is-required'
          ) {
            this.error = err.response.data.message.es
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

<style lang="scss">
.granger__update-files-modal-container {
  .columns {
    width: 100%;
    margin: auto;

    .file {
      label,
      a,
      span {
        width: 100%;
      }

      span.icon {
        width: 50px;
      }
    }
  }
}
</style>