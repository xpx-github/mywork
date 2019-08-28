<template>
  <div class="returnStorage">
    <header-nav>退库</header-nav>
    <div class="putStorage-content">
      <el-form>
        <el-form-item label="生产计划单:" style="text-align: left;margin-left: 10%;">
          <el-input v-model="PlanBill" placeholder="请扫描条码/二维码" autofocus="true" style="width: 90%;"></el-input>
        </el-form-item>
        <el-form-item id="card">
          <el-card class="box-card" body-style="padding:20">
            <div slot="header" class="clearfix" style="text-align: right;padding-left: 20px;  margin: 10px 6% 10px 0;">
              <span>工序计划单号:</span>
              <el-input type="text" v-model="item.计划单号" :disabled="true" style="width: 60%;" size="mini"></el-input>
              <br>
              <span>计划数量:</span>
              <el-input type="text" v-model="item.AS计划数量" :disabled="true" style="width: 60%;" size="mini"></el-input>
              <br>
              <span>产品编号:</span>
              <el-input type="text" v-model="item.产品编号" :disabled="true" style="width: 60%;" size="mini"></el-input>
              <br>
              <span>产品名称:</span>
              <el-input type="text" v-model="item.产品名称" :disabled="true" style="width: 60%;" size="mini"></el-input>
              <br>
              <span>上道工序:</span>
              <el-input type="text" v-model="item.上道工序" :disabled="true" style="width: 60%;" size="mini"></el-input>
              <br>
              <span>已领数量:</span>
              <el-input type="text" v-model="item.已领总数" :disabled="true" style="width: 60%;" size="mini"></el-input>
              <el-form-item style="text-align: center; margin: 20px">
              </el-form-item>
            </div>
            <div class="batch" style="width: 100%;height: 7%;background: #ab7cf0;color: white;">批次选择(物料信息)</div>
            <div v-for="(list,ins) in lists" :key="'ins' + ins" class="text item"
                 style="text-align: left;margin: 10px 0 10px 7%;">
              <span>批次号：{{list.批次号}}</span><br>
              <span>库存数量：{{list.库存数量}}</span><br>
              <span>退库数量:</span>
              <el-input type="text" v-model="list.num" :min="0" :max="list.库存数量" style="width: 35%; margin-left: 20px"
                        size="mini" id="tuiku"></el-input>
              <br>
              <span><el-button style="display: inline-block;margin-left: 70%" type="primary" @click="cof(list)">提交</el-button></span>
              <hr>
            </div>
          </el-card>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
  import headerNav from '../components/headerNav'
  import axios from 'axios'
  import {debounce} from '../../common/js/util'
  import qs from 'qs'

  export default {
    data() {
      return {
        NUM: '',
        num: [],
        PlanBill: '',
        item: [],
        lists: [],
        BatchStorage: ''
      }
    },
    components:{
      headerNav
    },
    mounted() {
      // 监听生产计划单输入框，延迟1.5s获取输入框内容
      this.$watch('PlanBill', debounce((NewPlanCode) => {
        this.$emit('PlanBill', NewPlanCode)
        // console.log(NewPlanCode)
        NewPlanCode = {PlanBill: NewPlanCode}
        axios.post('api/AppAccount/TK_PlanBasicAndStorageRecord', qs.stringify(NewPlanCode)).then((res) => {
          // console.log(res.data.data)
          if (res.data.success === true) {
            if (res.data.data[0]) {
              this.item = res.data.data[0]
              this.lists = res.data.data.map(x => Object.assign({}, x, {num: 0}))
            }else{
              this.$message.error('数据错误，请重新扫描')
              setTimeout(() => {
                window.location.reload();//刷新
              }, 500)
            }
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
    },
    methods: {
      //确认退库弹框
      cof(item) {
        var cof = confirm("是否确认退库?");
        if (cof == true) {
          var data = {
            PlanBill: this.PlanBill,
            BatchStorage: item.批次流水号,
            NUM: item.num + '',
          }
          axios.post('api/AppAccount/TK_Submit', qs.stringify(data)).then((res) => {
            // console.log(res)
            this.$message.success(res.data.data)
            setTimeout(() => {
              this.PlanBill = {PlanBill: this.PlanBill}
              axios.post('api/AppAccount/TK_PlanBasicAndStorageRecord', qs.stringify(this.PlanBill)).then((res) => {
                // console.log(res.data.data)
                this.PlanBill = String(res.data.data[0].计划单号)
                if (res.data.success == true) {
                  this.item = res.data.data[0]
                  this.lists = res.data.data.map(x => Object.assign({}, x, {num: 0}))
                }
              }).catch((err) => {
                console.log(err)
              })
              // window.location.reload() ;//刷新
            }, 500)
          }).catch((err) => {
            console.log(err)
          })
        } else {
          return false;
        }  //取消
      },

    }
  }

</script>

<style scoped>
  .returnStorage {
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
  .el-input.is-disabled>>> .el-input__inner{
    background-color: #fff;
    color: #2c3e50;
  }

  .clearfix {
    overflow: hidden;
  }

  .clearfix span {
    float: left;
  }
</style>
