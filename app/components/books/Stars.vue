<template>
  <div class="granger__books-stars-container">
    <template v-if="stars === 0">
      <i class="far fa-star"></i>
      <i class="far fa-star"></i>
      <i class="far fa-star"></i>
      <i class="far fa-star"></i>
      <i class="far fa-star"></i>
    </template>
    <template v-if="stars >= 1 && stars < 2">
      <i class="fas fa-star"></i>
      <i class="far fa-star"></i>
      <i class="far fa-star"></i>
      <i class="far fa-star"></i>
      <i class="far fa-star"></i>
    </template>
    <template v-if="stars >= 2 && stars < 3">
      <i class="fas fa-star"></i>
      <i class="fas fa-star"></i>
      <i class="far fa-star"></i>
      <i class="far fa-star"></i>
      <i class="far fa-star"></i>
    </template>
    <template v-if="stars >= 3 && stars < 4">
      <i class="fas fa-star"></i>
      <i class="fas fa-star"></i>
      <i class="fas fa-star"></i>
      <i class="far fa-star"></i>
      <i class="far fa-star"></i>
    </template>
    <template v-if="stars >= 4 && stars < 5">
      <i class="fas fa-star"></i>
      <i class="fas fa-star"></i>
      <i class="fas fa-star"></i>
      <i class="fas fa-star"></i>
      <i class="far fa-star"></i>
    </template>
    <template v-if="stars >= 5">
      <i class="fas fa-star"></i>
      <i class="fas fa-star"></i>
      <i class="fas fa-star"></i>
      <i class="fas fa-star"></i>
      <i class="fas fa-star"></i>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Book-Star',
  props: ['stars']
}
</script>

<style scoped lang="scss">
.granger__books-stars-container {
  margin-top: 5px;
}
</style>
