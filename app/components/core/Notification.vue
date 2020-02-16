<template>
  <b-notification
    :type="type"
    aria-close-label="Close notification"
    role="alert"
  >
    <ul v-if="Array.isArray(message)">
      <li v-for="(msg, i) in message" :key="i">- {{ msg.es }}</li>
    </ul>
    <span v-else>{{ message }}</span>
  </b-notification>
</template>

<script>
export default {
  name: 'Notification',
  props: ['type', 'message']
}
</script>
