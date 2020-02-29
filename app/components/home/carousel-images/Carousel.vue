<template>
  <b-carousel
    :animated="'slide'"
    :has-drag="true"
    :autoplay="true"
    :pause-hover="true"
    :pause-info="false"
    :interval="5000"
    @change="handleChange($event)"
  >
    <b-carousel-item v-for="(item, i) in items" :key="i">
      <Item :item="item" />
    </b-carousel-item>
  </b-carousel>
</template>

<script>
// Components
import Item from '~/components/home/carousel-images/Item'

export default {
  name: 'Home-Carousel-Images',
  components: {
    Item
  },
  data() {
    return {
      items: [
        {
          title: 'Lo último de lo último',
          subtitle: 'Sentirás el aroma a nuevo desde la pantalla',
          image: 'carousel1.jpg'
        },
        {
          title: 'Los más vendidos del 2019',
          subtitle: 'Entra que los tenemos todos para ti',
          image: 'carousel2.jpg'
        },
        {
          title: 'Libros que celebran el mes de la mujer',
          subtitle: '¡Ellas mandan!',
          image: 'carousel3.jpg'
        }
      ]
    }
  },
  methods: {
    handleChange(value) {
      this.carousel = value
    }
  }
}
</script>
