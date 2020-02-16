<template>
  <div class="granger__signup-container">
    <form @submit.prevent="handleSubmit">
      <div class="card">
        <div class="card-content">
          <b-field label="Nombre">
            <b-input
              placeholder="Nombre"
              v-model="newUser.firstName"
              required
            ></b-input>
          </b-field>
          <b-field label="Apellido">
            <b-input
              placeholder="Apellido"
              v-model="newUser.lastName"
              required
            ></b-input>
          </b-field>
          <b-field
            label="Correo Electrónico"
            :type="userExists ? 'is-danger' : null"
          >
            <b-input
              type="email"
              placeholder="Correo Electrónico"
              v-model="newUser.email"
              required
            >
            </b-input>
          </b-field>
          <b-field
            label="Contraseña"
            :type="passwordNotMatch ? 'is-warning' : null"
          >
            <b-input
              placeholder="Contraseña"
              type="password"
              password-reveal
              v-model="newUser.password"
              required
            ></b-input>
          </b-field>
          <b-field
            label="Verificar Contraseña"
            :type="passwordNotMatch ? 'is-warning' : null"
          >
            <b-input
              placeholder="Verificar Contraseña"
              type="password"
              password-reveal
              required
              v-model="newUser.verifyPassword"
            ></b-input>
          </b-field>
          <!-- Error -->
          <Notification v-if="error" type="is-danger" :message="error" />
        </div>
        <footer class="card-footer">
          <div class="card-footer-item">
            <b-button
              type="is-primary"
              :loading="isLoading"
              native-type="submit"
            >
              Registrarse
            </b-button>
          </div>
        </footer>
      </div>
    </form>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
  </div>
</template>

<script>
// Components
import Notification from '~/components/core/Notification'

export default {
  name: 'Auth-Signup',
  transition: 'fade',
  middleware: 'logged',
  head() {
    return {
      title: 'Registrarse | Granger'
    }
  },
  components: {
    Notification
  },
  data() {
    return {
      newUser: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        verifyPassword: ''
      },
      isLoading: false,
      error: null,
      passwordNotMatch: false,
      userExists: false
    }
  },
  methods: {
    async handleSubmit() {
      this.isLoading = true

      this.passwordNotMatch = false
      this.userExists = false

      if (this.newUser.password != this.newUser.verifyPassword) {
        this.isLoading = false
        this.passwordNotMatch = true
        this.error = 'La contraseña no coincide'
        setTimeout(() => (this.error = null), 5000)
      } else {
        await this.$axios
          .$post(`${process.env.URL_SERVER}/api/auth/signup`, this.newUser)
          .then(({ data }) => {
            this.$store.dispatch('logInAction', data)
            this.$cookies.set('token', data.token)
            this.$router.replace('/')
          })
          .catch(err => {
            console.log(err.response)
            if (
              err.response.data.code === 'auth/fields-cannot-be-empty' ||
              err.response.data.code === 'auth/user-exists'
            ) {
              this.userExists =
                err.response.data.code === 'auth/user-exists' ? true : false
              this.error = err.response.data.message.es
              setTimeout(() => (this.error = null), 5000)
            } else if (err.response.data.code === 'validator/wrong-fields') {
              this.error = err.response.data.data
              setTimeout(() => (this.error = null), 5000)
            } else {
              this.error = 'Error desconocido'
              setTimeout(() => (this.error = null), 5000)
            }
          })
          .finally(() => (this.isLoading = false))
      }
    }
  }
}
</script>

<style scoped lang="scss">
.granger__signup-container {
  height: calc(100vh - 112px);
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: center;

  .card {
    margin: 20px;
  }
}

@media (max-width: 768px) {
  .granger__signup-container {
    height: calc(100vh - 132px);
  }

  @media (max-height: 650px) {
    .granger__signup-container {
      padding-top: 20px;
    }
  }

  @media (max-height: 630px) {
    .granger__signup-container {
      padding-top: 50px;
    }
  }

  @media (max-height: 600px) {
    .granger__signup-container {
      padding-top: 80px;
    }
  }

  @media (max-height: 560px) {
    .granger__signup-container {
      padding-top: 120px;
    }
  }

  @media (max-height: 520px) {
    .granger__signup-container {
      padding-top: 160px;
    }
  }
  @media (max-height: 480px) {
    .granger__signup-container {
      padding-top: 200px;
    }
  }
}

@media (max-width: 425px) {
  .granger__signup-container {
    height: calc(100vh - 152px);
  }
}
</style>
