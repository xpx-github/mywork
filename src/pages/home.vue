<template>
  <div class="shouye">
    <div class="header">
      <span>工作台</span>
     <i class="fa fa-home" @click="isshow"></i>
      <div class="userInfo" v-if="show1">
        <span class=" fa fa-user-circle">&nbsp;&nbsp;{{OpenId}}</span>
        <span @click="userout"> 退出</span>
      </div>
      <!--<img src="../assets/images/退出.png">-->
    </div>
    <div class="menu">
      <a href="#/pick"><img class="pick" src="../assets/images/出库@2x.png"></a>
      <a href="#/putStorage"><img class="putStorage" src="../assets/images/入库@2x.png"></a>
      <a href="#/returnStorage"><img class="returnStorage" src="../assets/images/tuiku@2x.png"></a>
      <a href="#/search"><img class="search" src="../assets/images/库存查询@2x.png"></a>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: "home",
    data() {
      return {
        OpenId:'',
        show1:false,
      }
    },
    mounted(){
      let OpenId = JSON.parse(localStorage.getItem('sassToken')).OpenId;
      this.OpenId=OpenId
    },
    methods: {
      isshow(){
        this.show1 = !this.show1
      },
      userout() {
        //为了解决单点登录被挤掉线后点击退出按钮无效，所以采用直接回到首页的方法
        // axios.post('api/AppAccount/LogOut').then((res) => {
        //   // console.log(res)
        //   if (res.data.success == true) {
            this.$message.success('退出成功')
        setTimeout( () =>{
          location.href = '#/'
        },500)

      //     }
      //   }).catch((err) => {
      //     console.log(err)
      //   })
      }
    }
  }
</script>

<style scoped>

  .shouye {
    height: 100vh;
    padding-top: 50%;
  }

  .header {
    width: 100%;
    min-width: 200px;
    height: 60px;
    min-height: 30px;
    background: #000;
    position: fixed;
    top: 0;
    color: white;
    font-size: 22px;
    line-height: 65px;
    text-align: center;
  }
  .header i {
    font-size: 24px;
    position: absolute;
    right: 15px;
    top: 20px;
    color: #eeeeee;
  }
.header .userInfo{
  width: 70px;
  color: black;
  font-size: 16px;
  background: #eeeeee;
  position: absolute;
  right: 0;
  top:60px;
}
  .menu img {
    display: inline-block;
    width: 40%;
    min-width: 50px;
    height: 50%;
    min-height: 80px;
    margin: 10px;
  }

</style>
