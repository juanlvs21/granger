<template>
  <div>
    <b-navbar type="is-primary">
      <template slot="brand">
        <b-navbar-item tag="router-link" to="/">
          <img src="/images/logo-white-feather.png" alt="Granger" />
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item tag="router-link" to="/">Inicio</b-navbar-item>
        <template v-if="session && session.admin">
          <b-navbar-dropdown label="Libros">
            <b-navbar-item tag="router-link" to="/books">Todos</b-navbar-item>
            <b-navbar-item tag="router-link" to="/books/upload">Nuevo</b-navbar-item>
            <b-navbar-item tag="router-link" to="/books/genres">Géneros</b-navbar-item>
          </b-navbar-dropdown>
        </template>
        <template v-else>
          <b-navbar-item tag="router-link" to="/books">Libros</b-navbar-item>
        </template>
      </template>

      <template slot="end">
        <template v-if="session">
          <b-navbar-dropdown :label="session.firstName">
            <b-navbar-item tag="router-link" to="/profile">Perfil</b-navbar-item>
            <b-navbar-item @click="handleLogout">Salir</b-navbar-item>
          </b-navbar-dropdown>
        </template>
        <template v-else>
          <b-navbar-item tag="div">
            <div class="buttons">
              <nuxt-link to="/auth/signup" class="button is-primary is-small">
                <strong>Registrar</strong>
              </nuxt-link>
              <b-button type="is-light" size="is-small" @click="showModalLogin = true">Entrar</b-button>
            </div>
          </b-navbar-item>
        </template>
      </template>
    </b-navbar>

    <!-- Modal Login -->
    <b-modal :active.sync="showModalLogin" has-modal-card trap-focus aria-role="dialog" aria-modal>
      <ModalLogin />
    </b-modal>
  </div>
</template>

<script>
// Components
import SearchInput from '~/components/search/Input'
import ModalLogin from '~/components/modals/session/Login'

export default {
  name: 'Navbar',
  data() {
    return {
      showModalLogin: false,
      showModalLogout: false
    }
  },
  components: {
    SearchInput,
    ModalLogin
  },
  computed: {
    session() {
      return this.$store.state.user
    }
  },
  methods: {
    handleLogout() {
      this.$buefy.dialog.confirm({
        message: '¿Está seguro que desea <b>cerrar sesión</b>?',
        cancelText: 'Cancelar',
        confirmText: 'Cerrar sesión',
        onConfirm: () => {
          if (
            this.$route.path === '/books/upload' ||
            this.$route.path === '/books/genres' ||
            this.$route.path === '/profile'
          ) {
            this.$router.replace('/')
          }
          this.$store.dispatch('logInAction', null)
          this.$cookies.remove('token')

          this.$buefy.toast.open({
            message: 'Sesión Cerrada',
            position: 'is-bottom-right'
          })
        }
      })
    }
  }
}
</script>
