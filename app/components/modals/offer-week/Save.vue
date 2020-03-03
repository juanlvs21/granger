<template>
  <div class="granger__offer-week-modal-container">
    <div class="modal-card" style="max-width: 500px">
      <header class="modal-card-head">
        <h2 class="is-size-5">{{ selectedBook.title}}</h2>
      </header>

      <form @submit.prevent="handleSubmit">
        <section class="modal-card-body">
          <div class="columns">
            <div class="column">
              <b-field label="Descuento (%)">
                <b-numberinput
                  placeholder="Descuento (%)"
                  v-model.number="offer.percentage"
                  min="0"
                  max="100"
                  required
                ></b-numberinput>
              </b-field>
            </div>
          </div>
          <div class="columns has-text-centered">
            <div class="column is-6">
              <div class="field has-text-black-ter">
                <h3 class="is-size-6 has-text-weight-bold">Precio Actual:</h3>
                <p>${{selectedBook.price}}</p>
              </div>
            </div>
            <div class="column is-6">
              <div class="field has-text-black-ter">
                <h3 class="is-size-6 has-text-weight-bold">Nuevo Precio:</h3>
                <p class="has-text-primary has-text-weight-bold">${{newPrice}}</p>
              </div>
            </div>
          </div>

          <!-- Error -->
          <Notification v-if="error" type="is-danger" :message="error" />
        </section>
        <footer class="modal-card-foot">
          <button class="button" type="button" @click="handleClose">Cancelar</button>
          <b-button type="is-primary" :loading="isLoading" native-type="submit">Guardar Oferta</b-button>
        </footer>
      </form>

      <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
    </div>
  </div>
</template>

<script>
// Components
import Notification from '~/components/core/Notification'

export default {
  name: 'Modal-Offer-Week-Save',
  props: ['selectedBook', 'handleGetData'],
  components: {
    Notification
  },
  data() {
    return {
      offer: {
        book_uuid: this.selectedBook.uuid,
        percentage: 0
      },
      isLoading: false,
      error: null
    }
  },
  computed: {
    newPrice() {
      const discountedMoney =
        this.selectedBook.price * (this.offer.percentage / 100)
      return this.selectedBook.price - discountedMoney
    }
  },
  methods: {
    async handleSubmit() {
      this.isLoading = true

      await this.$axios
        .$post(
          `${process.env.URL_SERVER}/api/offer-week`,
          { offer: this.offer },
          {
            headers: {
              authorization: this.$store.state.user.token
            }
          }
        )
        .then(res => {
          this.handleGetData()
          this.$buefy.toast.open({
            duration: 3000,
            message: `Oferta de la semana guardada exitosamente`,
            position: 'is-bottom-right'
          })
          this.$parent.close()
        })
        .catch(err => {
          if (
            err.response.data.code ===
              'offer-week/there-is-already-an-offer-for-this-week' ||
            err.response.data.code === 'offer-week/wrong-percentage'
          ) {
            this.error = err.response.data.message.es
            setTimeout(() => (this.error = null), 5000)
          } else {
            this.error = 'Error inesperado'
            setTimeout(() => (this.error = null), 5000)
          }
        })
        .finally(() => (this.isLoading = false))
    },
    handleClose() {
      this.$parent.close()
    }
  }
}
</script>

<style scoped lang="scss">
.modal-card-body {
  justify-content: center;
}
</style>