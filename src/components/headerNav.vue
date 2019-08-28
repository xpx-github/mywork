<template>
  <div class="header">
   <a href="#/home"><img src="../assets/images/返回.png" alt=""></a>
    <span>
      <slot></slot>
    </span>
  </div>
</template>

<script>
    export default {

    }
</script>

<style scoped>

  .header {
  width: 100%;
  min-width: 200px;
  height: 60px;
  background: #000;
  position: fixed;
  top: 0;
  color: white;
  font-size: 22px;
  line-height: 65px;
  text-align: center;
  z-index: 9;
  }

  .header img {
  width: 30px;
  height: 30px;
  position: absolute;
  left: 10px;
  top: 17px;
  }
</style>
