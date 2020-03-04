<template>
  <div>
    <div class="granger__banner-discount-container">
      <img src="/images/banner-descuentos.png" alt="Descuentos" />
    </div>
    <div class="granger__books-container">
      <div class="container">
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
                      <p class="menu-label">Buscar por título</p>
                      <ul class="menu-list">
                        <form @submit.prevent="handleSearch">
                          <b-field>
                            <b-input
                              placeholder="Buscar"
                              type="search"
                              icon="magnify"
                              icon-clickable
                              native-type="submit"
                              v-model="inputSearch"
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
            <!-- <div class="columns">
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
            </div>-->
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
            <h1 class="granger__books-title is-size-2 has-text-centered">Lista de Libros</h1>

            <div class="granger__books-list-container">
              <Notification v-if="error.books" :message="error.books" type="is-danger" />
              <BookCard v-else v-for="book in books" :key="book.uuid" :book="book" />

              <b-pagination
                :total="paginatedBooks.length"
                :current.sync="current"
                :per-page="1"
                order="is-centered"
                icon-prev="chevron-left"
                icon-next="chevron-right"
                aria-next-label="Next page"
                aria-previous-label="Previous page"
                aria-page-label="Page"
                aria-current-label="Current page"
                @change="handlePaginator"
              ></b-pagination>
            </div>
          </div>
        </div>
      </div>
      <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
      <Newsletter style="margin-top: 100px;" />
    </div>
  </div>
</template>

<script>
// Components
import Notification from '~/components/core/Notification'
import BookCard from '~/components/books/Card'
import Stars from '~/components/books/Stars'
import Newsletter from '~/components/newsletter/Newsletter'

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
      paginatedBooks: [],
      genres: [],
      inputSearch: '',
      isLoading: false,
      error: {
        books: null,
        genres: null
      },
      selectedStars: 0,
      selectedGenre: null,
      filteredOut: false,
      current: 1
    }
  },
  methods: {
    async handleSearch() {
      this.isLoading = true
      this.filteredOut = true

      await this.$axios
        .$get(`${process.env.URL_SERVER}/api/search/${this.inputSearch}`)
        .then(({ data }) => {
          this.paginatedBooks = data
          this.books = this.paginatedBooks[0]
          this.paginatedBooks = data

          if (this.paginatedBooks.length === 0) {
            this.error.books = 'No hay libros disponibles'
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoading = false))
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
          this.paginatedBooks = data
          this.books = this.paginatedBooks[0]
          this.paginatedBooks = data

          if (this.paginatedBooks.length === 0) {
            this.error.books = 'No hay libros disponibles'
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
      this.inputSearch = ''

      await this.$axios
        .$get(`${process.env.URL_SERVER}/api/books`)
        .then(({ data }) => {
          this.filteredOut = false
          this.paginatedBooks = data
          this.books = this.paginatedBooks[0]
          this.paginatedBooks = data

          if (this.paginatedBooks.length === 0) {
            this.error.books = 'No hay libros disponibles'
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoading = false))
    },
    handlePaginator(e) {
      this.current = e
      this.books = this.paginatedBooks[this.current - 1]
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

      const paginatedBooks = getBooks.data

      return {
        genres: getGenres.data,
        books: paginatedBooks[0],
        paginatedBooks,
        error
      }
    } catch (err) {
      console.log(err)
    }
  }
}
</script>

<style scoped lang="scss">
.granger__books-container {
  padding-top: 30px;

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

.granger__banner-discount-container {
  width: 100%;
  background-color: var(--info);
  text-align: center;
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