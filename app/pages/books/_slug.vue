<template>
  <div class="granger__book-container">
    <div class="container has-text-centered granger__book-not-found" v-if="error">
      <!-- Error -->
      <img src="/images/book-not-found.webp" alt="Book not found" />
      <h1 class="is-size-1">¡OOPS!</h1>
      <h2 class="is-size-2">Libro no encontrado</h2>
      <div class="granger__book-not-found-btn-container">
        <b-button tag="nuxt-link" to="/" type="is-info">Ir al inicio</b-button>
        <b-button tag="nuxt-link" to="/books" type="is-primary">Ver todos los libros</b-button>
      </div>
    </div>
    <div class="container" v-else>
      <div class="granger__book-title-container">
        <h1 class="is-size-3">{{ book.title }}</h1>
        <div class="granger__book-admin-btn-container" v-if="session && session.admin">
          <b-button type="is-info" size="is-small" outlined>
            Editar
            <i class="fas fa-edit"></i>
          </b-button>
          <b-button
            type="is-danger"
            size="is-small"
            outlined
            :loading="isLoading"
            @click="handleDelete"
          >
            Eliminar
            <i class="fas fa-trash"></i>
          </b-button>
        </div>
      </div>
      <div class="columns">
        <div class="column is-6 granger__book-cover-container">
          <img
            class="granger__book-img"
            :src="`${server}/uploads/cover/${book.slug}/${book.cover}`"
            :alt="book.title"
          />
        </div>
        <div class="column is-6">
          <div class="granger__book-details-container">
            <!-- <div class="granger__book-stars-container">
              <Stars :stars="book.stars" />
            </div>-->

            <p class="is-size-1 has-text-info granger__book-price">$ {{ book.price }}</p>

            <div class="tags">
              <span class="tag is-info" v-for="(genre, i) in book.genre" :key="i">{{ genre }}</span>
            </div>

            <div class="granger__book-buy" v-if="session">
              <b-button type="is-primary" rounded @click="handlePaymentIntent">Comprar Libro</b-button>
              <b-button
                v-if="isFavorite"
                type="is-ligth"
                rounded
                @click="handleRemoveFavorite"
              >Eliminar de Favoritos</b-button>
              <b-button
                v-else
                type="is-ligth"
                rounded
                @click="handleAddFavorite"
              >Agregar a Favoritos</b-button>
            </div>

            <p>
              Autor/Autores:
              <b>{{ book.authors }}</b>
            </p>

            <p>{{ book.description }}</p>
          </div>
        </div>
      </div>
    </div>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>

    <!-- Modal Confirm Payment -->
    <b-modal
      :active.sync="showModalConfirmPayment"
      has-modal-card
      trap-focus
      aria-role="dialog"
      aria-modal
    >
      <ModalConfirmPayment
        :client_secret="client_secret"
        :payment_intents_id="payment_intents_id"
        :book_uuid="book.uuid"
      />
    </b-modal>

    <Newsletter style="margin-top: 100px;" />
  </div>
</template>

<script>
// Components
import Notification from '~/components/core/Notification'
import Newsletter from '~/components/home/Newsletter'
import Stars from '~/components/books/Stars'
import ModalConfirmPayment from '~/components/modals/books/ConfirmPayment'

export default {
  name: 'Books-details',
  transition: 'fade',
  head() {
    return {
      title: `${this.title} | Granger`
    }
  },
  components: {
    Notification,
    Newsletter,
    Stars,
    ModalConfirmPayment
  },
  data() {
    return {
      server: process.env.URL_SERVER,
      book: {},
      client_secret: null,
      payment_intents_id: null,
      showModalConfirmPayment: false,
      isLoading: false,
      error: null
    }
  },
  computed: {
    session() {
      return this.$store.state.user
    },
    title() {
      return this.book ? this.book.title : 'Libro no encontrado'
    },
    isFavorite() {
      // Returns 1 if it exists in the favorites list and 0 if not
      return this.$store.state.favorites.filter(favorite =>
        favorite.book_uuid === this.book.uuid ? true : false
      ).length
    }
  },
  methods: {
    async handlePaymentIntent() {
      this.isLoading = true

      const dataToBuy = {
        user_email: this.session.email,
        book_uuid: this.book.uuid
      }
      await this.$axios
        .$post(
          `${process.env.URL_SERVER}/api/books/paymentIntents`,
          dataToBuy,
          {
            headers: {
              authorization: this.session.token
            }
          }
        )
        .then(({ data }) => {
          this.payment_intents_id = data.id
          this.client_secret = data.client_secret
          this.showModalConfirmPayment = true
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoading = false))
    },
    handleDelete() {
      this.$buefy.dialog.confirm({
        message: `¿Desea Eliminar este libro?`,
        cancelText: 'Cancelar',
        confirmText: 'Eliminar',
        onConfirm: async () => {
          this.isLoading = true
          await this.$axios
            .$delete(`${process.env.URL_SERVER}/api/books/${this.book.uuid}`, {
              headers: {
                authorization: this.session.token
              }
            })
            .then(res => {
              this.$buefy.toast.open({
                duration: 3000,
                message: `Libro eliminador con satisfactoriamente`,
                position: 'is-bottom-right'
              })

              this.$router.replace('/books')
            })
            .catch(err => {
              console.log(err)
            })
            .finally(() => (this.isLoading = false))
        }
      })
    },
    async getBook() {
      this.isLoading = true

      await this.$axios
        .get(`${process.env.URL_SERVER}/api/books/slug/${params.slug}`)
        .then(({ data }) => {
          this.book = data
        })
        .finally(() => (this.isLoading = false))
    },
    handleAddFavorite() {
      this.$buefy.dialog.confirm({
        message: `¿Agregar a favoritos?`,
        cancelText: 'Cancelar',
        confirmText: 'Agregar',
        onConfirm: async () => {
          this.isLoading = true
          await this.$axios
            .$post(
              `${process.env.URL_SERVER}/api/favorites/add`,
              { book_uuid: this.book.uuid },
              {
                headers: {
                  authorization: this.$store.state.user.token
                }
              }
            )
            .then(({ data }) => {
              this.$store.dispatch('setFavoritesAction', data)
            })
            .catch(err => {
              console.log(err.response.data)
              console.log(err)
            })
            .finally(() => (this.isLoading = false))
        }
      })
    },
    handleRemoveFavorite() {
      this.$buefy.dialog.confirm({
        message: `¿Eliminar de favoritos?`,
        cancelText: 'Cancelar',
        confirmText: 'Eliminar',
        onConfirm: async () => {
          this.isLoading = true

          await this.$axios
            .$post(
              `${process.env.URL_SERVER}/api/favorites/remove`,
              { book_uuid: this.book.uuid },
              {
                headers: {
                  authorization: this.$store.state.user.token
                }
              }
            )
            .then(({ data }) => {
              this.$store.dispatch('setFavoritesAction', data)
            })
            .catch(err => {
              console.log(err)
            })
            .finally(() => (this.isLoading = false))
        }
      })
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
.granger__book-container {
  .granger__book-not-found {
    h2 {
      margin-bottom: 20px;
    }

    .granger__book-not-found-btn-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      .button {
        width: 200px;
        margin: 10px 0px;
      }
    }
  }

  .granger__book-stars-container {
    font-size: 24px;

    i {
      margin-right: 5px;
    }
  }

  .granger__book-buy {
    .button {
      width: 180px;
    }
  }
}
</style>

<style scoped lang="scss">
.granger__book-container {
  margin-top: 50px;

  .granger__book-title-container {
    margin-bottom: 30px;
    text-align: center;

    .granger__book-admin-btn-container {
      margin-top: 10px;

      .button {
        margin: 0 2px;
        width: 100px;
      }
    }
  }

  .granger__book-cover-container {
    text-align: right;

    .granger__book-img {
      width: 260px;
      height: 400px;
      -o-object-fit: cover;
      object-fit: cover;
      border-radius: 10px;
      margin-right: 100px;
    }
  }

  .granger__book-details-container {
    .granger__book-price {
      margin-top: 0;
    }

    p {
      margin-top: 10px;
    }

    .granger__book-buy {
      margin-top: 10px;
    }
  }
}

@media (max-width: 1024px) {
  .granger__book-container {
    .granger__book-cover-container {
      text-align: center;

      .granger__book-img {
        margin-right: 0;
      }
    }
  }
}

@media (max-width: 768px) {
  .granger__book-container {
    .granger__book-cover-container {
      text-align: center;
    }

    .granger__book-details-container {
      padding: 20px;

      .granger__book-stars-container,
      .granger__book-price {
        text-align: center;
      }

      .tags {
        display: flex;
        justify-content: center;
      }

      .granger__book-buy {
        text-align: center;
      }
    }
  }
}
</style>