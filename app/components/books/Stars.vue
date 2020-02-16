<template>
  <div class="granger__books-stars-container">
    <template v-if="stars === 0">
      <i class="far fa-star" @click="handleSelected ? handleSelected('stars', 1) : null"></i>
      <i class="far fa-star" @click="handleSelected ? handleSelected('stars', 2) : null"></i>
      <i class="far fa-star" @click="handleSelected ? handleSelected('stars', 3) : null"></i>
      <i class="far fa-star" @click="handleSelected ? handleSelected('stars', 4) : null"></i>
      <i class="far fa-star" @click="handleSelected ? handleSelected('stars', 5) : null"></i>
    </template>
    <template v-if="stars >= 1 && stars < 2">
      <i class="fas fa-star" @click="handleSelected ? handleSelected('stars', 1) : null"></i>
      <i class="far fa-star" @click="handleSelected ? handleSelected('stars', 2) : null"></i>
      <i class="far fa-star" @click="handleSelected ? handleSelected('stars', 3) : null"></i>
      <i class="far fa-star" @click="handleSelected ? handleSelected('stars', 4) : null"></i>
      <i class="far fa-star" @click="handleSelected ? handleSelected('stars', 5) : null"></i>
    </template>
    <template v-if="stars >= 2 && stars < 3">
      <i class="fas fa-star" @click="handleSelected ? handleSelected('stars', 1) : null"></i>
      <i class="fas fa-star" @click="handleSelected ? handleSelected('stars', 2) : null"></i>
      <i class="far fa-star" @click="handleSelected ? handleSelected('stars', 3) : null"></i>
      <i class="far fa-star" @click="handleSelected ? handleSelected('stars', 4) : null"></i>
      <i class="far fa-star" @click="handleSelected ? handleSelected('stars', 5) : null"></i>
    </template>
    <template v-if="stars >= 3 && stars < 4">
      <i class="fas fa-star" @click="handleSelected ? handleSelected('stars', 1) : null"></i>
      <i class="fas fa-star" @click="handleSelected ? handleSelected('stars', 2) : null"></i>
      <i class="fas fa-star" @click="handleSelected ? handleSelected('stars', 3) : null"></i>
      <i class="far fa-star" @click="handleSelected ? handleSelected('stars', 4) : null"></i>
      <i class="far fa-star" @click="handleSelected ? handleSelected('stars', 5) : null"></i>
    </template>
    <template v-if="stars >= 4 && stars < 5">
      <i class="fas fa-star" @click="handleSelected ? handleSelected('stars', 1) : null"></i>
      <i class="fas fa-star" @click="handleSelected ? handleSelected('stars', 2) : null"></i>
      <i class="fas fa-star" @click="handleSelected ? handleSelected('stars', 3) : null"></i>
      <i class="fas fa-star" @click="handleSelected ? handleSelected('stars', 4) : null"></i>
      <i class="far fa-star" @click="handleSelected ? handleSelected('stars', 5) : null"></i>
    </template>
    <template v-if="stars >= 5">
      <i class="fas fa-star" @click="handleSelected ? handleSelected('stars', 1) : null"></i>
      <i class="fas fa-star" @click="handleSelected ? handleSelected('stars', 2) : null"></i>
      <i class="fas fa-star" @click="handleSelected ? handleSelected('stars', 3) : null"></i>
      <i class="fas fa-star" @click="handleSelected ? handleSelected('stars', 4) : null"></i>
      <i class="fas fa-star" @click="handleSelected ? handleSelected('stars', 5) : null"></i>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Book-Star',
  props: ['stars', 'handleSelected']
}
</script>

<style scoped lang="scss">
.granger__books-stars-container {
  margin-top: 5px;
}
</style>
