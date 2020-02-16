<template>
  <div>
    <div class="container granger__books-container">
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
                      <b-field>
                        <b-input
                          placeholder="Buscar"
                          type="search"
                          icon="magnify"
                          icon-clickable
                          @icon-click="handleSearch"
                        ></b-input>
                      </b-field>
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
                      <li v-for="(genre, i) in genres" :key="i">
                        <a
                          @click="handleFilters('genre', genre.genre)"
                          :class="[selectedGenre === genre.genre ? 'is-active' : null]"
                        >{{ genre.genre }}</a>
                      </li>
                    </ul>
                  </aside>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-9">
          <div class="granger__books-list-container">
            <Notification v-if="error" :message="error" type="is-danger" />
            <BookCard v-else v-for="book in books" :key="book.uuid" :book="book" />
          </div>
        </div>
      </div>
      <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
    </div>
    <Newsletter />
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
      error: null,
      selectedStars: 0,
      selectedGenre: null,
      filteredOut: false
    }
  },
  methods: {
    async handleSearch() {},
    async handleFilters(filter, data) {
      this.isLoading = true
      this.filteredOut = true
      this.error = null

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
        .$get(`${process.env.URL_SERVER}/api/books/search/${filter}/${data}`)
        .then(({ data }) => {
          if (data.length === 0) {
            this.error = 'Resultados no encontrados'
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
      this.error = null
      this.selectedStars = 0
      this.selectedGenre = null

      await this.$axios
        .$get(`${process.env.URL_SERVER}/api/books/all`)
        .then(({ data }) => {
          this.filteredOut = false
          this.books = data
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoading = false))
    }
  },
  async asyncData({ $axios }) {
    try {
      const books = await $axios.$get(`${process.env.URL_SERVER}/api/books/all`)
      const genres = await $axios.$get(
        `${process.env.URL_SERVER}/api/books/genre`
      )

      return {
        books: books.data,
        genres: genres.data
      }
    } catch (err) {}
  }
}
</script>

<style scoped lang="scss">
.granger__books-container {
  padding-top: 30px;
  margin-bottom: 30px;

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