<template>
  <form id="payment-form" @submit.prevent="handleConfirmPayment">
    <div class="granger__confirmpayment-modal-container">
      <div class="modal-card" style="max-width: 500px">
        <header class="modal-card-head">
          <p class="card-header-title">{{ titleModal }}</p>
        </header>
        <section class="modal-card-body">
          <div v-if="successfulPurchase" class="has-text-centered">
            <p>Hemos enviado el libro a tu correo electrónico.</p>
            <p>
              <i>¡Feliz lectura!</i>
            </p>
          </div>
          <div v-else>
            <h1>Complete los siguientes campos:</h1>
            <div id="card-element"></div>
            <div id="card-errors" role="alert"></div>
            <!-- Error -->
            <Notification v-if="error" type="is-danger" :message="error" />
          </div>
        </section>
        <footer class="modal-card-foot">
          <template v-if="successfulPurchase">
            <button class="button is-primary" type="button" @click="$parent.close()">Aceptar</button>
          </template>
          <template v-else>
            <button class="button" type="button" @click="$parent.close()">Cancelar</button>
            <b-button type="is-primary" :loading="isLoading" native-type="submit">Confirmar</b-button>
          </template>
        </footer>
        <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
      </div>
    </div>
  </form>
</template>

<script>
// Components
import Notification from '~/components/core/Notification'

export default {
  name: 'Modal-Books-ConfirmPayment',
  components: {
    Notification
  },
  data() {
    return {
      stripe: null,
      elements: null,
      cardElement: null,
      titleModal: 'Confirmar compra',
      successfulPurchase: false,
      isLoading: false,
      error: null
    }
  },
  computed: {
    session() {
      return this.$store.state.user
    }
  },
  methods: {
    async handleConfirmPayment() {
      this.isLoading = true
      await this.stripe
        .confirmCardPayment(this.$attrs.client_secret, {
          payment_method: {
            card: this.cardElement,
            billing_details: {
              name: `${this.session.firstName} ${this.session.lastName}`
            }
          }
        })
        .then(async result => {
          if (result.error) {
            this.error = result.error.message
            setTimeout(() => (this.error = null), 5000)
          } else {
            if (result.paymentIntent.status === 'succeeded') {
              await this.$axios
                .$post(
                  `${process.env.URL_SERVER}/api/books/payment-succeeded`,
                  {
                    payment_intents: this.$attrs.payment_intents_id,
                    book_uuid: this.$attrs.book_uuid,
                    user_email: this.session.email
                  },
                  {
                    headers: {
                      authorization: this.session.token
                    }
                  }
                )
                .then(res => {
                  console.log(res)
                  this.successfulPurchase = true
                  this.titleModal = 'Gracias por su compra'
                })
                .catch(err => {
                  console.log(err.response.data)
                })
                .finally(() => (this.isLoading = false))
            }
          }
        })
        .catch(err => {
          console.log(err.response.data)
          this.error = 'Error inesperado'
          setTimeout(() => (this.error = null), 5000)
        })
        .finally(() => (this.isLoading = false))
    }
  },
  mounted() {
    this.stripe = Stripe(process.env.STRIPE_PK)
    this.elements = this.stripe.elements()
    this.cardElement = this.elements.create('card')
    this.cardElement.mount('#card-element')
  }
}
</script>

<style scoped lang="scss">
.modal-card-head {
  padding: 5px !important;
}
.modal-card-body {
  h1 {
    text-align: center;
    margin-bottom: 30px;
  }
  #card-element {
    margin-bottom: 20px;
  }
}

@media (max-width: 768px) {
  .modal-card {
    max-width: auto !important;
    width: 90% !important;
    margin: auto !important;
  }
}
</style>
