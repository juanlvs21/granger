<template>
  <div class="granger__follow-us-ig">
    <img src="/images/banner_ig.png" alt="Siguenos en Instagram" />
  </div>
</template>

<script>
export default {
  name: 'Follow-Us-Instagram'
}
</script>

<style scoped lang="scss">
.granger__follow-us-ig {
  background-color: var(--info);
  text-align: center;
  padding: 20px 0;
  // margin-top: 50px;
  border-bottom: 4px solid #fff;

  img {
    height: 150px;
  }
}

@media (max-width: 768px) {
  .granger__follow-us-ig {
    img {
      height: auto;
      width: 100%;
    }
  }
}
</style>