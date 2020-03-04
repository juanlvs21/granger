<template>
  <div class="granger__books-edit-container">
    <div class="container">
      <h1 class="is-size-2 has-text-centered has-text-weight-semibold">Actualizar información</h1>
      <form @submit.prevent="handleSubmit">
        <div class="columns">
          <div class="column has-text-right">
            <b-button
              type="is-danger"
              tag="nuxt-link"
              :to="`/books/${this.book.slug}`"
              rounded
              outlined
            >Atras</b-button>
            <b-button type="is-info" :loading="isLoading" native-type="submit" rounded>Actualizar</b-button>
          </div>
        </div>

        <!-- Error -->
        <Notification v-if="error" type="is-danger" :message="error" />
        <div class="columns is-multiline">
          <div class="column">
            <b-field label="Titulo">
              <b-input placeholder="Titulo" v-model="book.title" required></b-input>
            </b-field>
            <b-field label="Autor/Autores">
              <b-input placeholder="Autor/Autores" v-model="book.authors"></b-input>
            </b-field>
          </div>
          <div class="column">
            <b-field label="Precio ($)">
              <b-numberinput placeholder="Precio ($)" v-model.number="book.price" min="0" required></b-numberinput>
            </b-field>
            <b-field label="Año de publicación">
              <b-input placeholder="Año de publicación" v-model.number="book.yearPublication"></b-input>
            </b-field>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <b-field label="Descripción">
              <b-input placeholder="Descripción" type="textarea" v-model="book.description"></b-input>
            </b-field>
          </div>
        </div>
        <div class="columns is-multiline">
          <div class="column granger__books-genres-tags">
            <b-button type="is-primary" @click="showModalGenres = true">Género/Géneros</b-button>
            <div class="tags">
              <span class="tag is-info" v-for="(genre, i) in book.genre" :key="i">{{ genre }}</span>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- Modal Genres -->
    <b-modal :active.sync="showModalGenres" has-modal-card trap-focus aria-role="dialog" aria-modal>
      <ModalGenres :genres="book.genre" />
    </b-modal>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
  </div>
</template>

<script>
// Components
import Notification from '~/components/core/Notification'
import ModalGenres from '~/components/modals/books/Genres'

export default {
  name: 'Books-Update',
  transition: 'fade',
  middleware: 'adminRequired',
  head() {
    return {
      title: 'Editar Libro | Granger'
    }
  },
  components: {
    Notification,
    ModalGenres
  },
  data() {
    return {
      server: process.env.URL_SERVER,
      book: {
        title: '',
        authors: '',
        description: '',
        yearPublication: '',
        genre: [],
        price: 0
      },
      showModalGenres: false,
      isLoading: false,
      error: null
    }
  },
  methods: {
    async handleSubmit() {
      this.isLoading = true

      await this.$axios
        .$put(
          `${process.env.URL_SERVER}/api/books/${this.book.uuid}`,
          { book: this.book },
          {
            headers: {
              authorization: this.$store.state.user.token
            }
          }
        )
        .then(({ data }) => {
          this.$buefy.toast.open({
            duration: 3000,
            message: 'Información del libro actualizada satisfactoriamente',
            position: 'is-bottom-right'
          })
          this.$router.push(`/books/${data}`)
        })
        .catch(err => {
          console.log(err.response.data)
          if (
            err.response.data.code === 'auth/authentication-required' ||
            err.response.data.code === 'auth/required-permissions' ||
            err.response.data.code === 'books/the-book-already-exists' ||
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
    },
    handleChangePrice(e) {
      console.log(e)
    }
  },
  async asyncData({ $axios, params }) {
    return await $axios
      .$get(`${process.env.URL_SERVER}/api/books/slug/${params.slug}`)
      .then(res => {
        return { book: res.data }
      })
      .catch(err => {
        if (err.response.data.code === 'books/does-not-exist') {
          return { error: err.response.data.message.es }
        } else {
          return { error: 'Error desconocido, intente de nuevo' }
        }
      })
  }
}
</script>

<style lang="scss">
.granger__books-edit-container {
  .textarea {
    resize: none !important;
  }
}
</style>
<style scoped lang="scss">
.granger__books-edit-container {
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
  .granger__books-edit-container {
    height: calc(100vh - 132px);
  }
}

@media (max-width: 425px) {
  .granger__books-edit-container {
    height: calc(100vh - 152px);
  }
}
</style>
