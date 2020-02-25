<template>
  <form @submit.prevent="handleSubmit">
    <section class="modal-card-body">
      <div class="columns">
        <div class="column">
          <!-- Slot Input -->
          <slot />

          <!-- Error -->
          <Notification v-if="error" type="is-danger" :message="error" />
        </div>
      </div>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="handleClose">Cancelar</button>
      <b-button type="is-primary" :loading="isLoading" native-type="submit">{{titleButton}}</b-button>
    </footer>
  </form>
</template>

<script>
// Components
import Notification from '~/components/core/Notification'

export default {
  name: 'Modal-Genres-Form',
  props: ['titleButton', 'isLoading', 'error', 'handleSubmit', 'handleClose'],
  components: {
    Notification
  }
}
</script>