<template>
  <div class="granger__offerweek-container">
    <div class="columns">
      <div class="column granger__offerweek-text has-text-white has-text-centered">
        <h4 class="is-size-4">Oferta de la semana</h4>
        <h1 class="is-size-3">{{ offer.book.title }}</h1>
        <div class="granger_offerweek-prices">
          <span class="is-size-1">${{ offer.offer.newPrice }}</span>
          <span class="is-size-4 granger_offerweek-priceold">(${{ offer.book.price }})</span>
        </div>
        <VueCountdown :time="time" tag="p" class="is-size-1">
          <template slot-scope="props">
            {{ props.days }}D:{{ props.hours }}H:{{ props.minutes }}M:{{
            props.seconds
            }}S
          </template>
        </VueCountdown>

        <b-button type="is-dark" size="is-medium" tag="nuxt-link" :to="`/books/${offer.book.slug}`">
          Ver más
          <i class="fas fa-star"></i>
        </b-button>
      </div>
      <div class="column granger__offerweek-cover">
        <img
          :src="`${server}/uploads/cover/${offer.book.uuid}/${offer.book.cover}`"
          :alt="offer.book.title"
        />
      </div>
    </div>
  </div>
</template>

<script>
// Imports client
if (process.client) {
  var VueCountdown = require('@chenfengyuan/vue-countdown')
}

export default {
  name: 'Offer-Week',
  props: ['offer'],
  components: {
    VueCountdown
  },
  data() {
    return {
      server: process.env.URL_SERVER,
      time: this.offer
        ? new Date(this.offer.offer.lastDay).getTime() - new Date().getTime()
        : 0
    }
  }
}
</script>

<style scoped lang="scss">
.granger__offerweek-container {
  width: 100%;
  height: 400px;
  background-color: var(--info);
  margin: 50px 0px;
  border-top: 5px solid var(--primary);
  border-bottom: 5px solid var(--primary);

  .columns {
    width: 100%;
  }

  .columns,
  .column {
    height: inherit;
  }

  .granger__offerweek-cover,
  .granger__offerweek-text {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .granger__offerweek-cover {
    img {
      height: 300px;
      width: 200px;
      object-fit: contain;
      border: 2px solid #fff;
      border-radius: 10px;
      -webkit-box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.3);
      -moz-box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.3);
      box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.3);
    }
  }

  .granger__offerweek-text {
    .granger_offerweek-prices {
      display: flex;
      align-items: flex-end;

      .granger_offerweek-priceold {
        color: var(--red);
        text-decoration: line-through;
        padding-bottom: 11px;
        padding-left: 10px;
      }
    }

    .button {
      margin-top: 10px;
    }
  }
}

@media (max-width: 768px) {
  .granger__offerweek-container {
    position: relative;

    .columns {
      margin: 0;
    }

    .granger__offerweek-text {
      width: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      position: absolute;
      top: 0;
      padding: 10px;
    }
  }
}

@media (max-width: 425px) {
  .granger__offerweek-text {
    .is-size-1 {
      font-size: 38px !important;
    }

    .is-size-2 {
      font-size: 32px !important;
    }

    .is-size-4 {
      font-size: 28px !important;
    }

    .granger_offerweek-priceold {
      padding-bottom: 6px !important;
    }
  }
}
</style>
