<template>
  <form @submit.prevent="handleSearch">
    <b-field>
      <b-input
        placeholder="Buscar libro..."
        type="search"
        icon="magnify"
        size="is-small"
        icon-clickable
        @icon-click="handleSearch"
      ></b-input>
    </b-field>
  </form>
</template>

<script>
export default {
  name: 'Search-Input',
  methods: {
    handleSearch() {
      alert('Search')
    }
  }
}
</script>