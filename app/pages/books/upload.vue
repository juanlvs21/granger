<template>
  <div class="granger__books-genres-tagss-upload-container">
    <div class="container">
      <h1 class="is-size-2 has-text-centered has-text-weight-semibold">
        Nuevo libro
      </h1>
      <form @submit.prevent="handleSubmit">
        <div class="columns">
          <div class="column has-text-right">
            <b-button
              type="is-info"
              :loading="isLoading"
              native-type="submit"
              rounded
            >
              Subir
            </b-button>
          </div>
        </div>

        <!-- Error -->
        <Notification v-if="error" type="is-danger" :message="error" />
        <div class="columns is-multiline">
          <div class="column">
            <b-field label="Titulo">
              <b-input placeholder="Titulo" v-model="newBook.title"></b-input>
            </b-field>
            <b-field label="Autor/Autores">
              <b-input
                placeholder="Autor/Autores"
                v-model="newBook.authors"
              ></b-input>
            </b-field>
          </div>
          <div class="column">
            <b-field label="Precio ($)">
              <b-numberinput
                placeholder="Precio ($)"
                v-model="newBook.price"
              ></b-numberinput>
            </b-field>
            <b-field label="Año de publicación">
              <b-input
                placeholder="Año de publicación"
                v-model="newBook.yearPublication"
              ></b-input>
            </b-field>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <b-field label="Descripción">
              <b-input placeholder="Descripción" type="textarea"></b-input>
            </b-field>
          </div>
        </div>
        <div class="columns is-multiline">
          <div class="column granger__books-genres-tags">
            <b-button type="is-primary" @click="showModalGenres = true"
              >Género/Géneros</b-button
            >
            <div class="tags">
              <span
                class="tag is-info"
                v-for="(genre, i) in newBook.genre"
                :key="i"
              >
                {{ genre }}
              </span>
            </div>
          </div>
        </div>
        <div class="columns is-multiline">
          <div class="column">
            <b-field class="file">
              <b-upload v-model="files.pdf">
                <a class="button is-primary">
                  <b-icon icon="upload"></b-icon>
                  <span>Libro (PDF)</span>
                </a>
              </b-upload>
              <span class="file-name" v-if="files.pdf">
                {{ files.pdf.name }}
              </span>
            </b-field>
          </div>
          <div class="column">
            <b-field class="file">
              <b-upload v-model="files.cover">
                <a class="button is-primary">
                  <b-icon icon="upload"></b-icon>
                  <span>Portada</span>
                </a>
              </b-upload>
              <span class="file-name" v-if="files.cover">
                {{ files.cover.name }}
              </span>
            </b-field>
          </div>
        </div>
      </form>
    </div>

    <!-- Modal Genres -->
    <b-modal
      :active.sync="showModalGenres"
      has-modal-card
      trap-focus
      aria-role="dialog"
      aria-modal
    >
      <Genres :genres="newBook.genre" />
    </b-modal>
  </div>
</template>

<script>
// Components
import Notification from '~/components/core/Notification'
import Genres from '~/components/modals/books/Genres'

export default {
  name: 'Books-Upload-Page',
  transition: 'fade',
  middleware: 'adminRequired',
  head() {
    return {
      title: 'Nuevo Libro | Granger'
    }
  },
  components: {
    Notification,
    Genres
  },
  data() {
    return {
      newBook: {
        title: '',
        authors: '',
        description: '',
        yearPublication: '',
        genre: [],
        price: 0,
        uploadedBy: {
          uuid: null,
          firstName: null,
          lastName: null,
          email: null
        }
      },
      files: {
        pdf: null,
        cover: null
      },
      showModalGenres: false,
      isLoading: false,
      error: null
    }
  },
  methods: {
    async handleSubmit() {
      this.isLoading = true

      const bookForSend = {
        ...this.newBook
      }

      const formData = new FormData()
      formData.append('cover', this.files.cover)
      formData.append('pdf', this.files.pdf)
      formData.append('book', JSON.stringify(bookForSend))

      await this.$axios
        .$post(`${process.env.URL_SERVER}/api/books/upload`, formData, {
          headers: {
            authorization: this.$store.state.user.token
          }
        })
        .then(({ data }) => {
          this.$router.push(`/books/${data.data}`)
        })
        .catch(err => {
          if (
            err.response.data.code === 'auth/authentication-required' ||
            err.response.data.code === 'books/cover-pdf-is-required' ||
            err.response.data.code === 'books/cover-is-required' ||
            err.response.data.code === 'books/cover-must-be-jpg-jpeg-png' ||
            err.response.data.code === 'books/book-must-be-pdf' ||
            err.response.data.code === 'books/pdf-is-required' ||
            err.response.data.code === 'books/name-is-empty' ||
            err.response.data.code === 'books/price-greater-than-zero' ||
            err.response.data.code === 'books/price-year-must-be-numbers' ||
            err.response.data.code ===
              'books/year-publication-less-current-year'
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
.granger__books-genres-tagss-upload-container {
  .textarea {
    resize: none !important;
  }
}
</style>
<style scoped lang="scss">
.granger__books-genres-tagss-upload-container {
  height: calc(100vh - 112px);
  overflow-y: auto;
  padding: 30px 10px 10px 10px;

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

    .granger__books-genres-tags {
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      .tags {
        margin-bottom: 0 !important;
        .tag {
          margin: 5px;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .granger__books-genres-tagss-upload-container {
    height: calc(100vh - 132px);
  }
}

@media (max-width: 425px) {
  .granger__books-genres-tagss-upload-container {
    height: calc(100vh - 152px);
  }
}
</style>
