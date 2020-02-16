<template>
  <div class="granger__genres-modal-container">
    <div class="modal-card" style="max-width: 500px">
      <section class="modal-card-body">
        <h2 class="is-size-5 has-text-centered">
          Agregar Géneros
          <b-tooltip
            label="Para seleccionar un género haga click sobre el. Si el género que necesita no está, puede agregarlo a la base de datos"
            position="is-bottom"
            multilined
          >
            <i class="far fa-question-circle"></i>
          </b-tooltip>
        </h2>
        <div class="columns">
          <div class="column">
            <div class="tags">
              <span
                class="tag is-info"
                v-for="(genre, i) in allGenres"
                :key="i"
                @click="handleAdd(genre.genre)"
              >
                {{ genre.genre }}
              </span>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <form @submit.prevent="handleSubmit">
              <b-field>
                <b-input placeholder="Género" v-model="newGenre"></b-input>
                <p class="control">
                  <b-button
                    type="is-primary"
                    :loading="isLoading"
                    native-type="submit"
                  >
                    Nuevo
                  </b-button>
                </p>
              </b-field>
            </form>
          </div>
        </div>
        <hr />
        <h2 class="is-size-5 has-text-centered">
          Géneros Seleccionados
          <b-tooltip
            label="Para remover de la lista haga click sobre el género que desea remover"
            position="is-top"
            multilined
          >
            <i class="far fa-question-circle"></i>
          </b-tooltip>
        </h2>
        <div class="columns">
          <div class="column">
            <div class="tags">
              <span
                class="tag is-primary"
                v-for="(genre, i) in genres"
                :key="i"
                @click="handleRemove(genre)"
              >
                {{ genre }}
              </span>
            </div>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">
          Aceptar
        </button>
      </footer>
      <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal-Books-Genres',
  props: ['genres'],
  data() {
    return {
      allGenres: [],
      newGenre: '',
      isLoading: false
    }
  },
  methods: {
    async handleGetAllGenres() {
      this.isLoading = true

      await this.$axios
        .$get(`${process.env.URL_SERVER}/api/books/genre`)
        .then(({ data }) => {
          this.allGenres = data
        })
        .catch(err => console.log(err))
        .finally(() => (this.isLoading = false))
    },
    async handleSubmit() {
      this.isLoading = true

      await this.$axios
        .$post(
          `${process.env.URL_SERVER}/api/books/genre`,
          { genre: this.newGenre },
          {
            headers: {
              authorization: this.$store.state.user.token
            }
          }
        )
        .then(res => {
          this.newGenre = ''
          this.handleGetAllGenres()
        })
        .catch(err => console.log(err))
        .finally(() => (this.isLoading = false))
    },
    handleAdd(genre) {
      const newGenresSelecte = this.genres
      newGenresSelecte.push(genre)
      this.genres = newGenresSelecte
    },
    handleRemove(genre) {
      const newGenresSelecte = this.genres
      const i = newGenresSelecte.indexOf(genre)
      newGenresSelecte.splice(i, 1)
      this.genres = newGenresSelecte
    }
  },
  mounted() {
    this.handleGetAllGenres()
  }
}
</script>

<style lang="scss"></style>

<style scoped lang="scss">
.granger__genres-modal-container {
  .modal-card-body {
    .column {
      display: flex;
      justify-content: center;

      .tags {
        display: flex;
        justify-content: center;
        .tag {
          cursor: pointer;
        }
      }
    }
    h2 {
      margin-bottom: 20px;
    }
  }
}

@media (max-width: 768px) {
  .granger__genres-modal-container {
    padding: 10px;
    .modal-card {
      width: 100% !important;
      margin: auto !important;
    }
  }
}
</style>
