<template>
  <div class="container">
    <!--  登录 -->
    <header>
      <img class="headerImg" src="../assets/images/bg@2x.png" alt="">
    </header>
    <main>
      <el-row class="loginForm">
        <el-form class="login" ref="loginForm" :model="loginForm">
          <el-form-item prop="loginName" class="username">
            <el-input class="input" prefix-icon="" placeholder="请输入用户名称"
                      v-model="loginForm.UserName" id="one">
              <img class="userImg" slot="prefix" src="../assets/images/用户@2x.png">
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input class="input" prefix-icon="" type="password" placeholder="请输入密码"
                      v-model="loginForm.UserPwd" id="two">
              <img class="userImg" slot="prefix" src="../assets/images/密码@2x.png">
            </el-input>
          </el-form-item>
          <el-form-item class="button">
            <el-button class="confirm" type="primary" @click="submitForm">立即登录</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </main>
  </div>
</template>

<script>

  import axios from "axios";
  import qs from 'qs'

  export default {
    data() {
      return {
        loginForm: {
          UserName: "",
          UserPwd: ""
        }
      };
    },
    mounted() {
      this.getlocalstorage()
    },
    methods: {
      getlocalstorage() {
        var userName = localStorage.getItem('UserName');
        var userPass = localStorage.getItem('UserPwd');
        if (userName) {
          $('#one').val(userName);
        }
        if (userPass) {
          $('#two').val(userPass);
        }
      },
      submitForm() {
        var inpName = $('#one').val();
        var inpPass = $('#two').val();
        this.loginForm.UserName = inpName;
        this.loginForm.UserPwd = inpPass;
        var data1 = {
          UserName: inpName,
          UserPwd: inpPass,
        }
        axios.post("/api/APPAccount/Login", qs.stringify(data1)).then((res) => {
          //如果登录成功，本地保存输入的用户名密码
          // console.log(res)
          if (res.data.success === true) {
            var userName = $('#one').val();
            var userPass = $('#two').val();
            localStorage.setItem('UserName', userName);
            localStorage.setItem('UserPwd', userPass);
            localStorage.setItem('sassToken', JSON.stringify(res.data.data))
            this.$message.success(res.data.message)
            location.href = '#/home';
          } else {
            alert('用户名/密码错误，请重新输入')
          }
        }).catch((err) => {
          this.$message.error('登录错误')
          console.log(err)
        })
      }
    }
  };

</script>

<style scoped>
  .container {
    width: 100%;
    height: 100%;
  }

  .loginForm {
    border-radius: 3px;
    float: left;
    width: 100%;
    height: 100%;
    padding: 40px;
    margin-top: -30px;
  }

  .username {
    position: relative;
  }

  .confirm {
    width: 100%;
  }

  .headerImg {
    width: 100%;
    height: 100%;
    min-width: 200px;
    min-height: 200px;
  }

  >>> .el-button {
    height: 50px;
    font-size: 18px;
  }

  .userImg {
    width: 20px;
    height: 26px;
    margin: 10px 10px;
  }

  >>> .el-input--prefix .el-input__inner {
    height: 50px;
    font-size: 18px;
    padding-left: 50px;
  }
</style>
