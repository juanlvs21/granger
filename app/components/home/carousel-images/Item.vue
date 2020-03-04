<template>
  <section
    class="granger__carousel-images-container"
    :style="`background-image: url('/images/carousel/${item.image}')`"
  >
    <div class="granger__carousel-images-text">
      <div>
        <h1>{{ item.title }}</h1>
        <h3 class="is-size-3">{{ item.subtitle }}</h3>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Home-Carousel-Images-Item',
  props: ['item']
}
</script>

<style scoped lang="scss">
.granger__carousel-images-container {
  width: 100%;
  height: 500px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;

  .granger__carousel-images-text {
    height: inherit;
    display: flex;
    align-items: center;
    padding-left: 10%;

    h1 {
      font-family: 'Dancing Script';
      font-size: 4rem !important;
      line-height: 4rem;
    }
  }
}
@media (max-width: 768px) {
  .granger__carousel-images-container {
    .granger__carousel-images-text {
      h1 {
        font-size: 3.5rem !important;
        line-height: 3.5rem;
      }
    }
  }
}
</style>
