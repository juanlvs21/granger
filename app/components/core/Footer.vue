<template>
  <div class="granger__footer">
    © {{ new Date().getFullYear() }} Granger. Todos los derechos reservados. Hay
    grandes libros en el mundo y grandes mundos en los libros.
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      year: new Date().getFullYear()
    }
  }
}
</script>

<style scoped lang="scss">
.granger__footer {
  background-color: var(--info);
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  padding: 30px;
}

@media (max-width: 768px) {
  .granger__footer {
    height: 80px;
  }
}

@media (max-width: 425px) {
  .granger__footer {
    height: 100px;
  }
}
</style>
