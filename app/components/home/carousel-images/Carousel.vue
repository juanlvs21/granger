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
          title: 'Titulo de relleno 1',
          subtitle: 'Subtitulo de relleno 1',
          image: 'carousel1.jpg'
        },
        {
          title: 'Titulo de relleno 2',
          subtitle: 'Subtitulo de relleno 2',
          image: 'carousel2.jpg'
        },
        {
          title: 'Titulo de relleno 3',
          subtitle: 'Subtitulo de relleno 3',
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
