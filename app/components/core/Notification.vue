<template>
  <b-notification
    type="is-danger"
    aria-close-label="Close notification"
    role="alert"
  >
    {{ message }}
  </b-notification>
</template>

<script>
export default {
  name: 'Notification',
  props: ['message']
}
</script>
