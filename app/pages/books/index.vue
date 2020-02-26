<template>
  <div class="granger__books-container">
    <div class="container">
      <h1 class="granger__books-title is-size-2 has-text-centered">Lista de Libros</h1>
      <div class="columns">
        <div class="column is-3">
          <div class="columns" v-show="filteredOut">
            <div class="column">
              <b-button
                type="is-primary"
                size="is-small"
                expanded
                @click="handleRemoveFilters"
              >Eliminar filtros</b-button>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <div class="card">
                <div class="card-content">
                  <aside class="menu">
                    <p class="menu-label">Encuentra tú libro</p>
                    <ul class="menu-list">
                      <form @submit.prevent="handleSearch">
                        <b-field>
                          <b-input
                            placeholder="Buscar"
                            type="search"
                            icon="magnify"
                            icon-clickable
                            native-type="submit"
                            @icon-click="handleSearch"
                          ></b-input>
                        </b-field>
                      </form>
                    </ul>
                  </aside>
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <div class="card">
                <div class="card-content">
                  <aside class="menu">
                    <p class="menu-label">Buscar por Estrellas</p>
                    <ul class="menu-list">
                      <li class="has-text-centered">
                        <Stars :stars="selectedStars" :handleSelected="handleFilters" />
                      </li>
                    </ul>
                  </aside>
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <div class="card">
                <div class="card-content">
                  <aside class="menu">
                    <p class="menu-label">Buscar por Género</p>
                    <ul class="menu-list granger__menu-list">
                      <span v-if="error.genres">Sin géneros disponibles</span>
                      <template v-else>
                        <li v-for="(genre, i) in genres" :key="i">
                          <a
                            @click="handleFilters('genre', genre.genre)"
                            :class="[selectedGenre === genre.genre ? 'is-active' : null]"
                          >{{ genre.genre }}</a>
                        </li>
                      </template>
                    </ul>
                  </aside>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-9">
          <div class="granger__books-list-container">
            <Notification v-if="error.books" :message="error.books" type="is-danger" />
            <BookCard v-else v-for="book in books" :key="book.uuid" :book="book" />
          </div>
        </div>
      </div>
    </div>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
    <Newsletter style="margin-top: 100px;" />
  </div>
</template>

<script>
// Components
import Notification from '~/components/core/Notification'
import BookCard from '~/components/books/Card'
import Stars from '~/components/books/Stars'
import Newsletter from '~/components/home/Newsletter'

export default {
  name: 'Books-page',
  transition: 'fade',
  head() {
    return {
      title: 'Libros | Granger'
    }
  },
  components: {
    Notification,
    BookCard,
    Stars,
    Newsletter
  },
  data() {
    return {
      books: [],
      genres: [],
      isLoading: false,
      error: {
        books: null,
        genres: null
      },
      selectedStars: 0,
      selectedGenre: null,
      filteredOut: false
    }
  },
  methods: {
    async handleSearch() {
      await alert('Pronto :c')
    },
    async handleFilters(filter, data) {
      this.isLoading = true
      this.filteredOut = true
      this.error.books = null

      if (filter === 'stars') {
        //  If the filter is' star ', the new value of 'selectedStars' is assigned and the new value of 'selectedGenre' is null
        this.selectedStars = data
        this.selectedGenre = null
      } else if (filter === 'genre') {
        // If the filter is' genre ', the new value of 'selectedGenre' is assigned and the new value of 'selectedStars' is 0
        this.selectedGenre = data
        this.selectedStars = 0
      }

      await this.$axios
        .$get(`${process.env.URL_SERVER}/api/search/${filter}/${data}`)
        .then(({ data }) => {
          if (data.length === 0) {
            this.error.books = 'Resultados no encontrados'
          } else {
            this.books = data
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoading = false))
    },
    async handleRemoveFilters() {
      this.isLoading = true
      this.error.books = null
      this.selectedStars = 0
      this.selectedGenre = null

      await this.$axios
        .$get(`${process.env.URL_SERVER}/api/books`)
        .then(({ data }) => {
          this.filteredOut = false
          this.books = data
          if (this.books.length === 0) {
            this.error.books = 'No hay libros disponibles'
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoading = false))
    }
  },
  async asyncData({ $axios }) {
    try {
      const getBooks = await $axios.$get(`${process.env.URL_SERVER}/api/books`)
      const getGenres = await $axios.$get(
        `${process.env.URL_SERVER}/api/genres`
      )

      let error = {
        genres: null,
        books: null
      }

      if (getBooks.data.length === 0) {
        error.books = 'No hay libros disponibles'
      }

      return {
        genres: getGenres.data,
        books: getBooks.data,
        error
      }
    } catch (err) {}
  }
}
</script>

<style scoped lang="scss">
.granger__books-container {
  padding-top: 30px;

  .granger__books-title {
    margin-bottom: 30px;
  }

  .granger__menu-list {
    max-height: 400px;
    overflow-y: auto;
    direction: rtl;
    text-align: left;
  }

  .granger__menu-list::-webkit-scrollbar {
    width: 5px;
  }

  .granger__menu-list::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .granger__menu-list::-webkit-scrollbar-thumb {
    background: var(--primary);
  }

  .granger__menu-list::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  .granger__books-list-container {
    text-align: center;
  }
}

@media (max-width: 1024px) {
  .granger__books-container {
    .card {
      margin-left: 20px;
    }
  }
}

@media (max-width: 991px) {
  .granger__books-container {
    .card {
      .card-content {
        padding: 20px;
      }
    }
  }
}

@media (max-width: 768px) {
  .granger__books-container {
    .card {
      margin: 0 20px;
    }
  }
}
</style>