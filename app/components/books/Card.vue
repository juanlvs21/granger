<template>
  <div class="granger__book-card animated fadeIn">
    <img
      class="granger__book-card-img"
      :src="`${server}/uploads/cover/${book.slug}/${book.cover}`"
      :alt="book.title"
    />

    <div class="granger__book-card-details">
      <button
        class="granger__book-card-details-btn-fav"
        data-title="Añadir a Favoritos"
        @mouseover="favOver = true"
        @mouseleave="favOver = false"
        @click="handleFavorite"
      >
        <i v-if="favOver" class="fas fa-heart"></i>
        <i v-else class="far fa-heart"></i>
      </button>

      <p class="granger__book-card-details-title">{{ book.title }}</p>

      <Stars :stars="book.stars" />

      <p class="granger__book-card-details-price">$ {{ book.price }}</p>

      <p class="granger__book-card-details-authors">
        <i>{{ book.authors }}</i>
      </p>
      <nuxt-link :to="`/books/${book.slug}`" class="button is-small is-primary is-rounded">Ver más</nuxt-link>
    </div>
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
      favOver: false
    }
  },
  methods: {
    async handleFavorite() {
      await alert('Pronto :c')
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
