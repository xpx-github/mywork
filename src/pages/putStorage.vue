<template>
  <div class="putStorage">
    <header-nav>入库</header-nav>
    <div class="putStorage-content">
      <el-form>
        <el-form-item label="生产计划单:" style="text-align: left;margin-left: 10%;">
          <el-input v-model="PlanBill" :prop="PlanBill" placeholder="请扫描条码/二维码" autofocus="true"
                    style="width: 90%;"></el-input>
        </el-form-item>

        <el-form-item id="card">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="text-align: right;padding-left: 20px; margin: 10px 6% 10px 0;">
              <span>工序计划单号:</span>
              <el-input type="text" v-model="item.计划单号" style="width: 60%;" size="mini" :disabled="true"></el-input>
              <br>
              <span>计划数量:</span>
              <el-input type="text" v-model="item.计划数量" :disabled="true" style="width: 60%;" size="mini"></el-input>
              <br>
              <span>产品编号:</span>
              <el-input type="text" v-model="item.产品编号" :disabled="true" style="width: 60%;" size="mini"></el-input>
              <br>
              <span>产品名称:</span>
              <el-input type="text" v-model="item.产品名称" :disabled="true" style="width: 60%;" size="mini"></el-input>
              <br>
              <span>完工工序:</span>
              <el-input type="text" v-model="item.上道工序" :disabled="true" style="width: 60%;" size="mini"></el-input>
              <br>
            </div>
            <div class="batch" style="width: 100%;height: 7%;background: #ab7cf0;color: white;">批次选择(物料信息)</div>
            <div v-for="(list,ins) in lists" :key="'ins' + ins" class="text item"
                 style="text-align: left; margin: 10px 0 10px 7%;">
              <span>批次号：{{list.批次号}}</span><br>
              <span>库存数量：{{list.库存数量}}</span><br>
              <span>批次状态：{{list.批次状态}}</span>
              <el-button style=" padding: 8px 12px;display: inline-block;margin-left: 30px;" type="primary"
                         @click="cof(list)" id="sub" v-if="'display:none' ? list.批次状态=='待入库': list.批次状态=='已入库' ">提交
              </el-button>
              <el-button type="primary" @click="openPrint(list)"
                         style=" padding: 8px 12px;display:inline-block;margin-left: 30px;"
                         v-if="'display:none' ? list.批次状态=='已入库': list.批次状态=='待入库' ">打印
              </el-button>
            </div>
          </el-card>
        </el-form-item>
      </el-form>
    </div>

    <!--打印条码对话框-->
    <el-dialog
      title="打印条码"
      :visible.sync="dialogVisible"
      width="80%"
      :close-on-click-modal="false">
      <h1>{{this.item.打印条码}}</h1>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dayin">确 定</el-button>
  </span>
    </el-dialog>

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
        PlanBill: '',
        item: '',
        lists: [],
        list: '',
        MATERIAL_ID: '',
        P_ID: '',
        dialogVisible: false
      }
    },
    components: {
      headerNav
    },
    mounted() {
      // 监听生产计划单输入框，延迟1.5s获取输入框内容
      this.$watch('PlanBill', debounce((NewPlanCode) => {
        this.$emit('PlanBill', NewPlanCode)
        NewPlanCode = {PlanBill: NewPlanCode}
        axios.post('api/AppAccount/RK_PlanBasicAndStorageRecord', qs.stringify(NewPlanCode)).then((res) => {
          // console.log(res)
          if (res.data.success === true) {
            if (res.data.data[0]) {
              this.item = res.data.data[0]
              this.lists = res.data.data
            } else {
              this.$message.error('数据错误，请重新扫描')
              setTimeout(() => {
                window.location.reload();//刷新
              }, 500)
            }
          } else {
            this.$message.error('该计划单没有入库信息，请重新扫描')
            setTimeout(() => {
              window.location.reload();//刷新
            }, 500)
          }
        }).catch((err) => {
          console.log(err)
        })
      }, 1500))
    },
    methods: {
      //提交按钮的弹框
      cof(item) {
        var cof = confirm("是否确认将批次入库?");
        if (cof == true) {
          var data = {
            MATERIAL_ID: item.待入库物料ID,
            P_ID: item.P_ID,
          }
          axios.post('api/AppAccount/RK_Submit', qs.stringify(data)).then((res) => {
            if (res.data.success === true) {
              this.$message.success(res.data.data)
              setTimeout(() => {
                data = {PlanBill: this.PlanBill}
                axios.post('api/AppAccount/RK_PlanBasicAndStorageRecord', qs.stringify(data)).then((res) => {
                  if (res.data.success === true) {
                    this.item = res.data.data[0]
                    this.lists = res.data.data
                    this.PlanBill = Number(res.data.data[0].计划单号)
                  }
                }).catch((err) => {
                  this.$message.error('请求错误')
                  setTimeout(() => {
                    window.location.reload();//刷新
                  }, 1000)
                  console.log(err)
                })
              })
            } else {
              this.$message.error('请求错误')
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
        } else {
          return false;
        }  //取消
      },
      //打印条码对话框
      openPrint(value) {
        this.dialogVisible = true
        this.item = value
      },
      closePrint() {
        this.dialogVisible = false
      },
      //发送打印请求
      dayin() {
        let OpenId = JSON.parse(localStorage.getItem('sassToken')).OpenId
        var data1 = {
          PlanBill: this.item.计划单号,
          PDA_P_ID: 'pda1',
          BARCODE: this.item.打印条码,
          CREATE_USER: OpenId
        }
        axios.post('api/AppAccount/Print_Submit', qs.stringify(data1)).then((res) => {
          console.log(res)
          if (res.data.success == true) {
            this.$message.success(res.data.data)
            this.dialogVisible = false
          } else {
            this.$message.error('打印错误')
            this.dialogVisible = false
          }
        }).catch((err) => {
          this.$message.error('请求错误')
          console.log(err)
        })
      }
    }
  }
</script>

<style scoped>
  .putStorage {
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

  .el-input.is-disabled >>> .el-input__inner {
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
