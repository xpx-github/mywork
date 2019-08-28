<template>
  <div class="search">
   <header-nav>库存查询</header-nav>

    <!--扫码区域-->
    <el-form>
      <el-form-item label="批次号:" style="text-align: left;margin-left: 10%;">
        <el-input v-model="BatchNo" :prop="BatchNo" placeholder="请扫描条码/二维码" style="width: 90%;"></el-input>
      </el-form-item>
      <el-form-item label="库位:" style="text-align: left;margin-left: 10%;">
        <el-input v-model="PositionCode" :prop="PositionCode" placeholder="请扫描条码/二维码" style="width: 90%;"></el-input>
      </el-form-item>

      <!--批次号查询结果-->
      <el-form-item id="card">
        <el-card class="box-card">
          <div class="batch" style="width: 100%;height: 7%;background: #ab7cf0;color: white;">批次号查询</div>
          <div v-for="(item,ins) in items" :key="'ins' + ins" class="text item"
               style="text-align: left; margin: 10px 0 10px 7%;">
            <span>产品编号：{{item.物料编码}}</span><br>
            <span>产品名称：{{item.物料名称}}</span><br>
            <span>入库时间:  {{item.入库时间}}</span><br>
            <span>完工工序：{{item.完工工序}}</span><br>
            <span style="display: inline-block; margin-bottom: 10px">当前库位：{{item.当前库位}}</span>
            <br>
          </div>
          <div class="storage" style="width: 100%;height: 7%;background: #ab7cf0;color: white;">库位查询</div>
          <div v-for="(list,index) in lists" :key="'index' + index" class="text item"
               style="text-align: left; margin: 10px 0 10px 7%;">
            <span>批次号：{{list.批次号}}</span><br>
            <span>产品名称：{{list.物料名称}}</span><br>
            <span>产品编号：{{list.物料编码}}</span><br>
            <span>完工工序：{{list.完工工序}}</span><br>
            <span>入库时间：{{list.入库时间}}</span><br>
            <span style="display: inline-block; margin-bottom: 10px">结余数量：{{list.该批次结余数量}}</span>
            <br>
            <hr>
          </div>
        </el-card>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  import headerNav from '../components/headerNav'
  import axios from 'axios'
  import qs from 'qs'
  import {debounce} from '../../common/js/util'
  export default {
    data() {
      return {
        BatchNo: '',
        PositionCode: '',
        items: [],
        lists: []
      }
    },
    components:{
      headerNav
    },
    mounted(){
      // 监听批次号输入框，延迟1.5s获取输入框内容
      this.$watch('BatchNo', debounce((NewCode) => {
        this.$emit('BatchNo', NewCode)
        NewCode = {BatchNo: NewCode}
        axios.post('api/AppAccount/Query_BatchNo', qs.stringify(NewCode)).then((res) => {
          console.log(res)
          if(res.data.success==true){
            this.items = res.data.data
            console.log(this.items)
          }else {
            this.$message.error('该计划单没有退库信息，请重新扫描')
            setTimeout(() => {
              window.location.reload();//刷新
            }, 500)
          }
        }).catch((err) => {
          this.$message.error('请求错误')
          setTimeout(() => {
            window.location.reload();//刷新
          }, 500)
          console.log(err)
        })
      }, 1500))

      // 监听库位输入框，延迟1.5s获取输入框内容
      this.$watch('PositionCode', debounce((NewCode1) => {
        this.$emit('PositionCode', NewCode1)
        NewCode1 = {PositionCode: NewCode1}
        axios.post('api/AppAccount/Query_PositionCode', qs.stringify(NewCode1)).then((res) => {
          if (res.data.success==true){
            this.lists = res.data.data
          } else {
            this.$message.error('该计划单没有退库信息，请重新扫描')
            setTimeout(() => {
              window.location.reload();//刷新
            }, 500)
          }
        }).catch((err) => {
          this.$message.error('请求错误')
          setTimeout(() => {
            window.location.reload();//刷新
          }, 500)
          console.log(err)
        })
      }, 1500))

    },
    // methods: {
    //   //给生产计划单输入框添加@input事件，
    //   getPlan1(val) {
    //     var data1 = {BatchNo: val}
    //     axios.post('api/AppAccount/Query_BatchNo', qs.stringify(data1)).then((res) => {
    //       if(res.data.success==true){
    //         this.items = res.data.data
    //         console.log(this.items)
    //       }else {
    //         this.$message.error('该计划单没有退库信息，请重新扫描')
    //         setTimeout(() => {
    //           window.location.reload();//刷新
    //         }, 1500)
    //       }
    //     }).catch((err) => {
    //       console.log(err)
    //     })
    //
    //   },
    //   //给库位查询输入框添加@input事件，
    //   getPlan2(value) {
    //     //通过判断输入长度来延迟执行post请求
    //       var data2 = {PositionCode: value}
    //       axios.post('api/AppAccount/Query_PositionCode', qs.stringify(data2)).then((res) => {
    //         if (res.data.success==true){
    //           this.lists = res.data.data
    //         } else {
    //           this.$message.error('该计划单没有退库信息，请重新扫描')
    //           setTimeout(() => {
    //             window.location.reload();//刷新
    //           }, 1500)
    //         }
    //       }).catch((err) => {
    //         console.log(err)
    //       })
    //     }
    // }
  }
</script>

<style scoped>
  .search {
    margin-top: 15%;
  }

  >>> .el-input {
    width: 80%;
  }

  >>> .el-form-item__label {
    padding: 0;
    float: none;
    font-size: 18px;
    display: inline-block;
    margin-top: 5%;
  }

  >>> .el-form-item {
    margin-bottom: 0;
  }

  #card {
    width: 80%;
    margin: 10%;
  }

  >>> .el-card__header {
    padding: 0;
  }

  >>> .el-card__body {
    padding: 0;
  }
</style>
