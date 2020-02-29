<template>
  <div class="granger__profile-container">
    <div class="container">
      <div class="columns">
        <div class="column is-4">
          <div class="card granger__card-profile">
            <div class="card-header">
              <h1 class="card-header-title">Mi Perfil</h1>
            </div>
            <div class="card-content">
              <p>
                <b>Nombre:</b>
                {{session.firstName}}
              </p>
              <p>
                <b>Apellido:</b>
                {{session.lastName}}
              </p>
              <p>
                <b>Email:</b>
                {{session.email}}
              </p>
              <div class="buttons">
                <b-button
                  type="is-primary"
                  expanded
                  @click="showModalUpdateProfile = true"
                >Actualizar</b-button>
                <b-button type="is-info" expanded>Cambiar Contraseña</b-button>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-8">
          <div class="card">
            <div class="card-content">
              <b-tabs>
                <b-tab-item label="Mis Favoritos" v-if="session">
                  <b-collapse
                    class="card"
                    v-for="(favorite, index) of session.favorites"
                    :key="index"
                    :open="isOpenFavorites == index"
                    @open="isOpenFavorites = index"
                  >
                    <div slot="trigger" slot-scope="props" class="card-header" role="button">
                      <p class="card-header-title">{{ favorite.title }}</p>
                      <div class="card-header-icon">
                        <b-tooltip label="Ir al Libro" position="is-top">
                          <b-button
                            type="is-text"
                            size="is-small"
                            outlined
                            tag="nuxt-link"
                            :to="`/books/${favorite.slug}`"
                          >
                            <i class="fas fa-eye"></i>
                          </b-button>
                        </b-tooltip>
                        <b-tooltip label="Eliminar de Favoritos" position="is-top">
                          <b-button
                            type="is-text"
                            size="is-small"
                            outlined
                            @click="handleRemoveFavorite(favorite.uuid)"
                          >
                            <i class="fas fa-heart-broken"></i>
                          </b-button>
                        </b-tooltip>
                        <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"></b-icon>
                      </div>
                    </div>
                    <div class="card-content granger__collapse-favorite-content">
                      <div class="content">
                        <div class="tags">
                          <span
                            class="tag is-info"
                            v-for="(genre, i) in favorite.genre"
                            :key="i"
                          >{{ genre }}</span>
                        </div>
                        {{ favorite.description }}
                        <p>
                          <span>
                            Autor:
                            <b>
                              <i>{{ favorite.authors}}</i>
                            </b>
                          </span>
                          <br />
                          <span>
                            Precio:
                            <b>
                              <i class="has-text-danger">${{ favorite.price}}</i>
                            </b>
                          </span>
                        </p>
                      </div>
                    </div>
                  </b-collapse>
                </b-tab-item>

                <b-tab-item label="Mis Compras">
                  Lorem
                  <br />ipsum
                  <br />dolor
                  <br />sit
                  <br />amet.
                </b-tab-item>
              </b-tabs>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Update Profile -->
    <b-modal
      :active.sync="showModalUpdateProfile"
      has-modal-card
      trap-focus
      aria-role="dialog"
      aria-modal
    >
      <ModalUpdateProfile :profileData="session" />
    </b-modal>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
  </div>
</template>

<script>
// Components
import ModalUpdateProfile from '~/components/modals/profile/Update'

export default {
  name: 'Profile-page',
  transition: 'fade',
  head() {
    return {
      title: 'Perfil | Granger'
    }
  },
  components: {
    ModalUpdateProfile
  },
  data() {
    return {
      isOpenFavorites: 0,
      isLoading: false,
      showModalUpdateProfile: false
    }
  },
  computed: {
    session() {
      return this.$store.state.user
    }
  },
  methods: {
    handleRemoveFavorite(favorite_uuid) {
      this.$buefy.dialog.confirm({
        message: `¿Eliminar de favoritos?`,
        cancelText: 'Cancelar',
        confirmText: 'Eliminar',
        onConfirm: async () => {
          this.isLoading = true
          const data = {
            user_uuid: this.session.uuid,
            book_uuid: favorite_uuid
          }

          await this.$axios
            .$post(`${process.env.URL_SERVER}/api/favorites/remove`, data, {
              headers: {
                authorization: this.$store.state.user.token
              }
            })
            .then(async res => {
              await this.$axios
                .post(`${process.env.URL_SERVER}/api/auth/token`, {
                  token: this.session.token
                })
                .then(({ data }) => {
                  this.$store.dispatch('logInAction', data.data)
                  this.$buefy.toast.open({
                    duration: 3000,
                    message: 'Libro eliminado de favoritos',
                    position: 'is-bottom-right'
                  })
                  this.isOpenFavorites = 1
                })
            })
            .catch(err => {
              console.log(err)
            })
            .finally(() => (this.isLoading = false))
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.granger__profile-container {
  height: calc(100vh - 112px);
  overflow-y: auto;
  padding-top: 30px;

  .granger__card-profile {
    .card-content {
      p {
        margin-bottom: 20px;
      }
    }
  }

  .granger__collapse-favorite-content {
    .tags {
      margin-bottom: 10px;
      display: flex;
      justify-content: center;
    }
    p {
      margin-top: 10px;
    }
  }
}

@media (max-width: 768px) {
  .granger__profile-container {
    height: calc(100vh - 132px);
  }
}
</style>