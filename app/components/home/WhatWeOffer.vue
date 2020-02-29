<template>
  <div class="granger__offer-card">
    <div class="granger__offer-icon">
      <i :class="[offer.icon]"></i>
    </div>
    <div class="granger__offer-card-content">
      <h1 class="is-size-5">{{ offer.title }}</h1>
      <p>{{ offer.subtitle }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home-What-We-Offer',
  props: ['offer']
}
</script>

<style scoped lang="scss">
.granger__offer-card {
  background-color: #fff;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  border-radius: 5px;
  width: 300px;
  height: 150px;
  position: relative;
  margin: 20px 10px;
  top: 0;
  transition: all 300ms ease;
  border: none;

  .granger__offer-icon {
    background-color: #3f4d71;
    color: #fff;
    width: 65px;
    height: 65px;
    border-radius: 65px;
    font-size: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 15px;
    top: -25px;
  }

  .granger__offer-card-content {
    width: auto;
    padding: 10px 5px;
    margin-left: 80px;
  }
}

.granger__offer-card:hover {
  -webkit-box-shadow: 0px 8px 5px 0px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 0px 8px 5px 0px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 8px 5px 0px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 0, 0, 0.1);
  top: -10px;
}
</style>
