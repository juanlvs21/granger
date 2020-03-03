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
            default-sort="genre"
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
                <button class="granger__genre-action-btn" @click="handleShowModalEdit(props.row)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="granger__genre-action-btn" @click="handleDelete(props.row)">
                  <i class="fas fa-trash"></i>
                </button>
              </b-table-column>
            </template>
            <template slot="bottom-left">
              <div class="granger__genre-new-btn">
                <b-button
                  type="is-primary"
                  size="is-small"
                  @click="showModalAddGenre = true"
                >Nuevo Género</b-button>
              </div>
            </template>
          </b-table>
        </div>
      </div>
    </div>

    <!-- Modal Add Genre -->
    <b-modal
      :active.sync="showModalAddGenre"
      has-modal-card
      trap-focus
      aria-role="dialog"
      aria-modal
    >
      <ModalAddGenre :handleGetAllGenres="handleGetAllGenres" />
    </b-modal>

    <!-- Modal Edit Genre -->
    <b-modal
      :active.sync="showModalEditGenre"
      has-modal-card
      trap-focus
      aria-role="dialog"
      aria-modal
    >
      <ModalEditGenre :handleGetAllGenres="handleGetAllGenres" :selectedGenre="selectedGenre" />
    </b-modal>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
  </div>
</template>

<script>
// Components
import ModalAddGenre from '~/components/modals/genres/Add'
import ModalEditGenre from '~/components/modals/genres/Edit'

export default {
  name: 'Books-Genres-Page',
  transition: 'fade',
  middleware: 'adminRequired',
  head() {
    return {
      title: 'Administrar Géneros | Granger'
    }
  },
  components: {
    ModalAddGenre,
    ModalEditGenre
  },
  data() {
    return {
      genres: [],
      showModalAddGenre: false,
      showModalEditGenre: false,
      selectedGenre: null,
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
        .$get(`${process.env.URL_SERVER}/api/genres`)
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
          this.isLoading = true
          await this.$axios
            .$delete(`${process.env.URL_SERVER}/api/genres/${_id}`, {
              headers: {
                authorization: this.session.token
              }
            })
            .then(res => {
              console.log(res)

              this.handleGetAllGenres()

              this.$buefy.toast.open({
                duration: 3000,
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
    },
    handleShowModalEdit(genre) {
      this.selectedGenre = genre
      this.showModalEditGenre = true
    }
  },
  async asyncData({ $axios }) {
    try {
      const genres = await $axios.$get(`${process.env.URL_SERVER}/api/genres`)

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