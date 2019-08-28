<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{
    }
  },
}
</script>

<style>
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
  ul{
   list-style: none;
  }
a{
  text-decoration: none;
  color: #2c3e50;
  margin: 0 !important;
}
  .el-button{
    margin-bottom: 10px;
  }
  .el-card.is-always-shadow{
    box-shadow: none;
  }

  .modelBox-enter, .modelBox-leave-to {
    transform: translateY(-100%);
    opacity: 0;
  }

  .modelBox-enter-active, .modelBox-leave-active {
    transition: .5s;
  }
  .el-input-number__increase,.el-input-number__decrease,.el-dialog__headerbtn .el-dialog__close{
    display: none;
  }
</style>
