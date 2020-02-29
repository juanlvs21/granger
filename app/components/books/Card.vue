<template>
  <div class="granger__book-card animated fadeIn">
    <img
      class="granger__book-card-img"
      :src="`${server}/uploads/cover/${book.slug}/${book.cover}`"
      :alt="book.title"
    />

    <div class="granger__book-card-details">
      <template v-if="session">
        <button
          v-if="isFavorite"
          class="granger__book-card-details-btn-fav"
          data-title="Eliminar de Favoritos"
          @mouseover="favOver = true"
          @mouseleave="favOver = false"
          @click="handleRemoveFavorite"
        >
          <i class="fas fa-heart-broken"></i>
        </button>
        <button
          v-else
          class="granger__book-card-details-btn-fav"
          data-title="Añadir a Favoritos"
          @mouseover="favOver = true"
          @mouseleave="favOver = false"
          @click="handleAddFavorite"
        >
          <i v-if="favOver" class="fas fa-heart"></i>
          <i v-else class="far fa-heart"></i>
        </button>
      </template>

      <p class="granger__book-card-details-title">{{ book.title }}</p>

      <Stars :stars="book.stars" />

      <p class="granger__book-card-details-price">$ {{ book.price }}</p>

      <p class="granger__book-card-details-authors">
        <i>{{ book.authors }}</i>
      </p>
      <nuxt-link :to="`/books/${book.slug}`" class="button is-small is-primary is-rounded">Ver más</nuxt-link>
    </div>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
  </div>
</template>

<script>
// Components
import Stars from '~/components/books/Stars'

export default {
  name: 'Books-Card',
  props: ['book'],
  components: {
    Stars
  },
  data() {
    return {
      server: process.env.URL_SERVER,
      favOver: false,
      isLoading: false
    }
  },
  computed: {
    session() {
      return this.$store.state.user
    },
    isFavorite() {
      // Returns 1 if it exists in the favorites list and 0 if not
      return this.session.favorites.filter(favorite =>
        favorite.uuid === this.book.uuid ? true : false
      ).length
    }
  },
  methods: {
    handleAddFavorite() {
      this.$buefy.dialog.confirm({
        message: `¿Agregar a favoritos?`,
        cancelText: 'Cancelar',
        confirmText: 'Agregar',
        onConfirm: async () => {
          this.isLoading = true
          const data = {
            user_uuid: this.session.uuid,
            book_uuid: this.book.uuid
          }

          await this.$axios
            .$post(`${process.env.URL_SERVER}/api/favorites/add`, data, {
              headers: {
                authorization: this.$store.state.user.token
              }
            })
            .then(async res => {
              await this.$axios
                .post(`${process.env.URL_SERVER}/api/auth/token`, {
                  token: this.session.token
                })
                .then(({ data }) => {
                  this.$store.dispatch('logInAction', data.data)
                  this.$buefy.toast.open({
                    duration: 3000,
                    message: 'Libro agregado a favoritos',
                    position: 'is-bottom-right'
                  })
                })
            })
            .catch(err => {
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
          const data = {
            user_uuid: this.session.uuid,
            book_uuid: this.book.uuid
          }

          await this.$axios
            .$post(
              `${process.env.URL_SERVER}/api/user/favorites/remove`,
              data,
              {
                headers: {
                  authorization: this.$store.state.user.token
                }
              }
            )
            .then(async res => {
              await this.$axios
                .post(`${process.env.URL_SERVER}/api/auth/token`, {
                  token: this.session.token
                })
                .then(({ data }) => {
                  this.$store.dispatch('logInAction', data.data)
                  this.$buefy.toast.open({
                    duration: 3000,
                    message: 'Libro eliminado de favoritos',
                    position: 'is-bottom-right'
                  })
                  this.isOpenFavorites = 1
                })
            })
            .catch(err => {
              console.log(err)
            })
            .finally(() => (this.isLoading = false))
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.granger__book-card {
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  display: inline-block;
  width: 200px;
  height: 300px;
  margin: 0 10px 25px 10px;
  left: 0;
  cursor: pointer;
  transition: all 450ms;
  -webkit-transform-origin: center left;
  transform-origin: center left;

  .granger__book-card-img {
    width: 200px;
    height: 300px;
    -o-object-fit: cover;
    object-fit: cover;
  }

  .granger__book-card-details {
    align-items: center;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.9) 0%,
      rgba(0, 0, 0, 0) 100%
    );
    bottom: 0;
    display: flex;
    font-size: 10px;
    flex-direction: column;
    justify-content: flex-end;
    left: 0;
    opacity: 0;
    transition: 450ms opacity;
    padding: 10px;
    position: absolute;
    right: 0;
    top: 0;
    color: white;

    .granger__book-card-details-btn-fav {
      color: var(--red);
      background-color: transparent;
      border: none;
      position: absolute;
      top: 10px;
      right: 0px;
      font-size: 20px;
      opacity: 0;
      transition: all 300ms ease-in;
      cursor: pointer;
    }

    .granger__book-card-details-btn-fav::before {
      background-color: rgba(0, 0, 0, 0.7);
      border-radius: 5px;
      color: #fff;
      content: attr(data-title);
      font-size: 14px;
      padding: 0px 5px;
      position: absolute;
      right: 35px;
      top: 3px;
      width: 120px;
      z-index: 1;
      opacity: 0;
      transition: all 300ms ease-in;
    }

    .granger__book-card-details-btn-fav:hover {
      background-color: transparent;
      color: var(--primary);
    }

    .granger__book-card-details-btn-fav:focus {
      outline: none;
    }

    .granger__book-card-details-title {
      color: white;
      text-align: center;
      font-size: 16px;
      line-height: 18px;
      font-weight: bold;
    }

    .granger__book-card-details-price {
      font-size: 24px;
    }

    .granger__book-card-details-authors {
      font-size: 12px;
      margin-top: 5px;
      margin-bottom: 10px;
    }

    .button {
      font-weight: bold;
      transition: background-color 300ms;
    }

    .button:hover {
      background-color: var(--info);
    }
  }
}

.granger__book-card:focus {
  outline: none;
}

.granger__book-card:hover {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
  left: -10px;

  .granger__book-card-details-btn-fav {
    opacity: 1;
    right: 10px;
    transition: all 300ms ease-in;
  }

  .granger__book-card-details-btn-fav:hover::before {
    opacity: 1;
  }

  .granger__book-card-details {
    opacity: 1;
  }
}
</style>
