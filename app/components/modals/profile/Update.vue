<template>
  <div class="granger__profile-modal-container">
    <div class="modal-card" style="max-width: 500px">
      <header class="modal-card-head">
        <h2 class="is-size-5">Actualizar Perfil</h2>
      </header>
      <form @submit.prevent="handleSubmit">
        <section class="modal-card-body"></section>
        <footer class="modal-card-foot">
          <button class="button" type="button" @click="$parent.close()">Cancelar</button>
          <b-button type="is-primary" :loading="isLoading" native-type="submit">Actualizar</b-button>
        </footer>
      </form>
      <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal-Profile-Update',
  props: ['profileData'],
  data() {
    return {
      profile: { ...this.profileData },
      isLoading: false
    }
  },
  methods: {
    handleSubmit() {}
  }
}
</script>