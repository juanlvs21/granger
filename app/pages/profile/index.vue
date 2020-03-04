<template>
  <div class="granger__profile-container">
    <div class="container">
      <div class="columns">
        <div class="column is-4">
          <div class="card granger__card-profile" v-if="session">
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
                <b-button
                  type="is-info"
                  expanded
                  @click="showModalChangePassword = true"
                >Cambiar Contraseña</b-button>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-8">
          <div class="card">
            <div class="card-content">
              <b-tabs>
                <b-tab-item label="Mis Favoritos" v-if="session">
                  <!-- Error -->
                  <Notification
                    v-if="!favorites.length"
                    type="is-danger"
                    message="No posee favoritos agregados"
                  />
                  <b-collapse
                    v-else
                    class="card"
                    v-for="(favorite, index) of favorites"
                    :key="index"
                    :open="isOpenFavorites == index"
                    @open="isOpenFavorites = index"
                  >
                    <div slot="trigger" slot-scope="props" class="card-header" role="button">
                      <p class="card-header-title">{{ favorite.book.title }}</p>
                      <div class="card-header-icon">
                        <b-tooltip label="Ir al Libro" position="is-top">
                          <b-button
                            type="is-text"
                            size="is-small"
                            outlined
                            tag="nuxt-link"
                            :to="`/books/${favorite.book.slug}`"
                          >
                            <i class="fas fa-eye"></i>
                          </b-button>
                        </b-tooltip>
                        <b-tooltip label="Eliminar de Favoritos" position="is-top">
                          <b-button
                            type="is-text"
                            size="is-small"
                            outlined
                            @click="handleRemoveFavorite(favorite.book_uuid)"
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
                            v-for="(genre, i) in favorite.book.genre"
                            :key="i"
                          >{{ genre }}</span>
                        </div>
                        {{ favorite.book.description }}
                        <p>
                          <span>
                            Autor:
                            <b>
                              <i>{{ favorite.book.authors}}</i>
                            </b>
                          </span>
                          <br />
                          <span>
                            Precio:
                            <b>
                              <i class="has-text-danger">${{ favorite.book.price}}</i>
                            </b>
                          </span>
                        </p>
                      </div>
                    </div>
                  </b-collapse>
                </b-tab-item>

                <b-tab-item label="Mis Compras">
                  <!-- Error -->
                  <Notification
                    v-if="!purchases.length"
                    type="is-danger"
                    message="No posees ninguna compra realizada, ¡Anímate!"
                  />
                  <template v-else>
                    <div
                      class="card granger__purchanse-card"
                      v-for="(purchase, i) of purchases"
                      :key="i"
                    >
                      <div class="card-content">
                        <h2 class="is-size-5">{{purchase.title}}</h2>
                        <p>
                          Fecha de Compra:
                          {{purchase.date_purchase | formattedDate}}
                        </p>
                      </div>
                      <footer class="card-footer">
                        <nuxt-link
                          :to="`/books/${purchase.slug}`"
                          class="card-footer-item"
                        >Ver Libro</nuxt-link>
                        <a
                          class="card-footer-item"
                          @click="handleResend(purchase.uuid)"
                        >Volver a enviar</a>
                      </footer>
                    </div>
                  </template>
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
      <ModalUpdateProfile />
    </b-modal>
    <!-- Modal Change Password -->
    <b-modal
      :active.sync="showModalChangePassword"
      has-modal-card
      trap-focus
      aria-role="dialog"
      aria-modal
    >
      <ModalChangePassword />
    </b-modal>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
  </div>
</template>

<script>
// Components
import Notification from '~/components/core/Notification'
import ModalUpdateProfile from '~/components/modals/profile/Update'
import ModalChangePassword from '~/components/modals/profile/ChangePassword'

export default {
  name: 'Profile-page',
  transition: 'fade',
  middleware: 'authRequired',
  head() {
    return {
      title: 'Perfil | Granger'
    }
  },
  components: {
    ModalUpdateProfile,
    Notification,
    ModalChangePassword
  },
  data() {
    return {
      isOpenFavorites: 0,
      isLoading: false,
      showModalUpdateProfile: false,
      showModalChangePassword: false
    }
  },
  computed: {
    session() {
      return this.$store.state.user
    },
    favorites() {
      return this.$store.state.favorites
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
          await this.$axios
            .$post(
              `${process.env.URL_SERVER}/api/favorites/remove`,
              { book_uuid: favorite_uuid },
              {
                headers: {
                  authorization: this.$store.state.user.token
                }
              }
            )
            .then(({ data }) => {
              this.$store.dispatch('setFavoritesAction', data)
            })
            .catch(err => {
              console.log(err)
            })
            .finally(() => (this.isLoading = false))
        }
      })
    },
    async handleResend(uuid) {
      this.isLoading = true

      await this.$axios
        .$post(
          `${process.env.URL_SERVER}/api/books/purchases/resend`,
          { uuid },
          {
            headers: {
              authorization: this.session.token
            }
          }
        )
        .then(res => {
          this.$buefy.toast.open({
            duration: 3000,
            message:
              'Libro reenviado satisfactoriamente, nos vemos en bandeja de entrada',
            position: 'is-bottom-right'
          })
        })
        .catch(err => {
          console.log(err.response.data)
          this.$buefy.toast.open({
            duration: 3000,
            message: 'Error inesperado',
            position: 'is-bottom-right'
          })
        })
        .finally(() => (this.isLoading = false))
    }
  },
  async asyncData({ $axios, store }) {
    try {
      const getPurchases = await $axios.$get(
        `${process.env.URL_SERVER}/api/books/purchases`,
        {
          headers: {
            authorization: store.state.user.token
          }
        }
      )

      return {
        purchases: getPurchases.data
      }
    } catch (err) {
      console.log(err)
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

  .granger__purchanse-card {
    margin-bottom: 20px;
  }
}

@media (max-width: 768px) {
  .granger__profile-container {
    height: calc(100vh - 132px);
  }
}
</style>