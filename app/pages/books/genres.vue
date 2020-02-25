<template>
  <div class="granger__genres-container">
    <div class="container">
      <h1 class="granger__books-title is-size-2 has-text-centered">Lista de Géneros</h1>
      <div class="columns">
        <div class="column">
          <b-table
            :loading="false"
            :data="genres"
            :per-page="10"
            paginated
            pagination-simple
            current-page.sync="1"
            pagination-position="bottom"
            default-sort-direction="asc"
            default-sort="id"
            aria-next-label="Next page"
            aria-previous-label="Previous page"
            aria-page-label="Page"
            aria-current-label="Current page"
          >
            <template slot-scope="props">
              <b-table-column field="genre" label="Género" centered sortable>
                <div>{{ props.row.genre }}</div>
              </b-table-column>
              <b-table-column label="Acciones" centered>
                <button class="granger__genre-action-btn">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="granger__genre-action-btn" @click="handleDelete(props.row)">
                  <i class="fas fa-trash"></i>
                </button>
              </b-table-column>
            </template>
            <template slot="bottom-left">
              <div class="granger__genre-new-btn">
                <b-button type="is-primary" size="is-small">Nuevo Género</b-button>
              </div>
            </template>
          </b-table>
        </div>
      </div>
    </div>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
  </div>
</template>

<script>
export default {
  name: 'Books-Genres-Page',
  transition: 'fade',
  middleware: 'adminRequired',
  head() {
    return {
      title: 'Administrar Géneros | Granger'
    }
  },
  data() {
    return {
      genres: [],
      isLoading: false
    }
  },
  computed: {
    session() {
      return this.$store.state.user
    }
  },
  methods: {
    async handleGetAllGenres() {
      this.isLoading = true
      await this.$axios
        .$get(`${process.env.URL_SERVER}/api/books/genre`)
        .then(({ data }) => {
          this.genres = data
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoading = false))
    },
    handleDelete({ _id, genre }) {
      this.$buefy.dialog.confirm({
        message: `¿Desea Eliminar el genero <b><i>${genre}</i></b>?`,
        cancelText: 'Cancelar',
        confirmText: 'Eliminar',
        onConfirm: async () => {
          await this.$axios
            .$delete(`${process.env.URL_SERVER}/api/books/genre/${_id}`, {
              headers: {
                authorization: this.session.token
              }
            })
            .then(res => {
              console.log(res)

              this.handleGetAllGenres()

              this.$buefy.toast.open({
                message: `Género <b><i>${genre}</i></b> eliminado exitosamente`,
                position: 'is-bottom-right'
              })
            })
            .catch(err => {
              console.log(err)
            })
            .finally(() => (this.isLoading = false))
        }
      })
    }
  },
  async asyncData({ $axios }) {
    try {
      const genres = await $axios.$get(
        `${process.env.URL_SERVER}/api/books/genre`
      )

      return {
        genres: genres.data
      }
    } catch (err) {}
  }
}
</script>

<style scoped lang="scss">
.granger__genres-container {
  height: calc(100vh - 112px);
  overflow-y: auto;
  padding-top: 30px;

  .granger__genre-action-btn {
    background-color: transparent;
    border: none;
    width: 35px;
    cursor: pointer;
    color: var(--info);
  }
  .granger__genre-action-btn:hover {
    color: var(--primary);
  }
}

@media (max-width: 768px) {
  .granger__genres-container {
    height: calc(100vh - 132px);

    .granger__genre-new-btn {
      text-align: center;
    }
  }
}
</style>