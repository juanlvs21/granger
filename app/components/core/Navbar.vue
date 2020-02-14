<template>
  <b-navbar type="is-primary">
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <!-- <img
          src="https://raw.githubusercontent.com/buefy/buefy/dev/static/img/buefy-logo.png"
          alt="Lightweight UI components for Vue.js based on Bulma"
        /> -->
        Granger
      </b-navbar-item>
    </template>
    <template slot="start">
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        Inicio
      </b-navbar-item>
      <b-navbar-item tag="router-link" :to="{ path: '/books' }">
        Libros
      </b-navbar-item>
      <!-- <b-navbar-dropdown label="Info">
        <b-navbar-item href="#">About</b-navbar-item>
        <b-navbar-item href="#">Contact</b-navbar-item>
      </b-navbar-dropdown>-->
    </template>

    <template slot="end">
      <b-navbar-item tag="div">
        <div class="buttons">
          <a class="button is-primary is-small">
            <strong>Registrar</strong>
          </a>
          <b-button type="is-light" size="is-small">Entrar</b-button>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
// Components
import SearchInput from '~/components/search/Input'

export default {
  name: 'Navbar',
  components: {
    SearchInput
  }
}
</script>
