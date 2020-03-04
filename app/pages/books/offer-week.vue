<template>
  <div class="granger__offer-week-container">
    <div class="container">
      <h1 class="granger__books-title is-size-2 has-text-centered">Oferta de la semana</h1>
      <div class="columns" v-if="offerWeek">
        <div class="column">
          <h2 class="is-size-4">Libro seleccionado</h2>
          <div class="card">
            <div class="card-content">
              <div class="columns">
                <div class="column is-6">
                  <p>
                    <b>Título:</b>
                    {{offerWeek.book.title}}
                  </p>
                </div>
                <div class="column is-6">
                  <p>
                    <b>Autor/Autores:</b>
                    {{offerWeek.book.authors}}
                  </p>
                </div>
              </div>
              <div class="columns">
                <div class="column is-6">
                  <p>
                    <b>Precio Original:</b>
                    $ {{offerWeek.book.price}}
                  </p>
                </div>
                <div class="column is-6">
                  <p>
                    <b>
                      Nuevo Precio
                      <span class="has-text-danger">(-{{offerWeek.offer.percentage}}%)</span>:
                    </b>
                    $ {{offerWeek.offer.newPrice}}
                  </p>
                </div>
              </div>
            </div>
            <footer class="card-footer">
              <a class="card-footer-item" @click="handleDelete">Delete</a>
            </footer>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <b-table
            :loading="false"
            :data="books"
            :per-page="10"
            paginated
            pagination-simple
            current-page.sync="1"
            pagination-position="bottom"
            default-sort-direction="asc"
            default-sort="title"
            aria-next-label="Next page"
            aria-previous-label="Previous page"
            aria-page-label="Page"
            aria-current-label="Current page"
          >
            <template slot-scope="props">
              <b-table-column field="title" label="Título" centered sortable>
                <div>{{ props.row.title }}</div>
              </b-table-column>
              <b-table-column field="authors" label="Autor/Autores" centered sortable>
                <div>{{ props.row.authors }}</div>
              </b-table-column>
              <b-table-column label="Elegir Oferta" centered>
                <span
                  v-if="offerWeek && offerWeek.book.uuid === props.row.uuid"
                  class="is-size-6"
                >Actual</span>
                <b-button
                  v-else
                  type="is-primary"
                  size="is-small"
                  outlined
                  class="granger_offer-week-table-btn"
                  @click="handleShowModalSaveOfferWeek(props.row)"
                >Elegir</b-button>
              </b-table-column>
            </template>
          </b-table>
        </div>
      </div>
    </div>

    <!-- Modal Save Offer Week -->
    <b-modal
      :active.sync="showModalSaveOfferWeek"
      has-modal-card
      trap-focus
      aria-role="dialog"
      aria-modal
    >
      <ModalSaveOfferWeek :selectedBook="selectedBook" :handleGetData="handleGetData" />
    </b-modal>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
  </div>
</template>

<script>
// Components
import ModalSaveOfferWeek from '~/components/modals/offer-week/Save'

export default {
  name: 'Books-Offer-Week',
  transition: 'fade',
  middleware: 'adminRequired',
  head() {
    return {
      title: 'Oferta de la semana | Granger'
    }
  },
  components: {
    ModalSaveOfferWeek
  },
  data() {
    return {
      books: [],
      offerWeek: null,
      showModalSaveOfferWeek: false,
      selectedBook: null,
      isLoading: false,
      error: {
        books: null,
        offerWeek: null
      }
    }
  },
  methods: {
    handleShowModalSaveOfferWeek(book) {
      this.selectedBook = book
      this.showModalSaveOfferWeek = true
    },
    async handleGetData() {
      this.isLoading = true

      try {
        const getBooks = await this.$axios.$get(
          `${process.env.URL_SERVER}/api/books`
        )
        const getOfferWeek = await this.$axios.$get(
          `${process.env.URL_SERVER}/api/offer-week`
        )

        let error = {
          books: null,
          offerWeek: null
        }

        if (getBooks.data.length === 0) {
          this.error.books = 'No hay libros disponibles'
        }

        this.books = getBooks.data
        this.offerWeek = getOfferWeek.data
        this.error = error

        this.isLoading = false
      } catch (err) {
        console.log(err)
        this.isLoading = false
      }
    },
    handleDelete() {
      this.$buefy.dialog.confirm({
        message: `¿Desea eliminar la oferta de la semana?`,
        cancelText: 'Cancelar',
        confirmText: 'Eliminar',
        onConfirm: async () => {
          this.isLoading = true
          await this.$axios
            .$delete(
              `${process.env.URL_SERVER}/api/offer-week/${this.offerWeek.offer._id}`,
              {
                headers: {
                  authorization: this.$store.state.user.token
                }
              }
            )
            .then(res => {
              this.handleGetData()
              this.$buefy.toast.open({
                duration: 3000,
                message: `Oferta de la semana eliminada exitosamente`,
                position: 'is-bottom-right'
              })
            })
            .catch(err => {
              this.$buefy.toast.open({
                duration: 3000,
                type: 'is-danger',
                message: 'Error inesperado',
                position: 'is-bottom-right'
              })
            })
            .finally(() => (this.isLoading = false))
        }
      })
    }
  },
  async asyncData({ $axios }) {
    try {
      const getBooks = await $axios.$get(`${process.env.URL_SERVER}/api/books`)
      const getOfferWeek = await $axios.$get(
        `${process.env.URL_SERVER}/api/offer-week`
      )

      let error = {
        books: null,
        offerWeek: null
      }

      if (getBooks.data.length === 0) {
        error.books = 'No hay libros disponibles'
      }

      return {
        books: getBooks.data,
        offerWeek: getOfferWeek.data,
        error
      }
    } catch (err) {
      console.log(err)
      this.isLoading = false
    }
  }
}
</script>

<style scoped lang="scss">
.granger__offer-week-container {
  height: calc(100vh - 112px);
  overflow-y: auto;
  padding-top: 30px;

  .granger_offer-week-table-btn {
    width: 70px !important;
  }
}

@media (max-width: 768px) {
  .granger__offer-week-container {
    height: calc(100vh - 132px);

    .granger__genre-new-btn {
      text-align: center;
    }
  }
}
</style>