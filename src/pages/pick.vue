<template>
  <div class="pick">
    <header-nav>出库</header-nav>

    <el-form>
      <!--扫码区域-->
      <el-form-item label="生产计划单:" style="text-align: left;margin-left: 10%">
        <el-input v-model="PlanBill" :placeholder="placeholder" autofocus="true" style="width: 90%;" id="one"></el-input>
      </el-form-item>
      <el-form-item label="扫码出库:" style="text-align: left;margin-left: 10%">
        <el-input v-model="BatchStorageId" :placeholder="placeholder" autofocus="true" style="width: 90%;"
                  id="two"></el-input>
      </el-form-item>
      <!--卡片展示出库详细信息-->
      <el-form-item id="card">
        <el-card class="box-card">
          <div slot="header" class="clearfix" style="text-align: right;padding-left: 20px; margin-right: 6%">
            <span>工序计划单号:</span>
            <el-input type="text" v-model="item.计划单号" :disabled="true" style="width: 60%; " size="mini"></el-input>
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
            <span>待加工工序:</span>
            <el-input type="text" v-model="item.待加工工序" :disabled="true" style="width: 60%;" size="mini"></el-input>
            <br>
            <span>上道工序:</span>
            <el-input type="text" v-model="item.上道工序" :disabled="true" style="width: 60%;" size="mini"></el-input>
            <br>
            <span>需领总数:</span>
            <el-input type="text" v-model="item.需领总数" :disabled="true" style="width: 60%;" size="mini"></el-input>
            <br>
            <span>未领数量:</span>
            <el-input type="text" v-model="item.未领取数量" :disabled="true" style="width: 60%;" size="mini"
                      id="three"></el-input>
            <br>
            <el-form-item style="text-align: center; margin: 20px">
              <el-button type="primary" @click="openDialogbox"  id="jinyong">提交</el-button>
            </el-form-item>
          </div>
          <div class="batch" style="width: 100%;height: 7%;background: #ab7cf0;color: white;">批次选择(物料信息)</div>
          <div v-for="(list,ins) in lists" :key="'ins' + ins" class="text item"
               style="text-align: left; margin: 10px 0 10px 7%;">
            <span>批次号: {{list.批次号}}</span><br>
            <span>领料数量:</span>
            <el-input-number type="text" v-model="num[ins]" size="mini" :max="list.该批次结余数量" :min="0"
                             style="width: 50%;margin-left: 20px"></el-input-number>
            <br>
            <span>结余数量: {{list.该批次结余数量}}</span><br>
            <hr>
          </div>
        </el-card>
      </el-form-item>
    </el-form>
    <!--本次出库总数对话框-->
    <el-dialog
      title="本次出库总数量"
      :visible.sync="dialogVisible"
      width="80%"
      :close-on-click-modal="false">
      <el-input type="text" v-model="NUM" readonly></el-input>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitForm">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import headerNav from '../components/headerNav'
  import axios from 'axios'
  import {debounce} from '../../common/js/util'
  import qs from 'qs'

  export default {
    props: {
      placeholder: {
        type: String,
        default: '请扫描条码/二维码'
      }
    },
    data() {
      return {
        NUM: '',
        num: [],
        PlanBill: '',
        BatchStorageId: '',
        BatchStorage: [],
        item: '',
        lists: [],
        dialogVisible: false,
      }
    },
    components:{
      headerNav
    },
    //监听输入框，延迟发送请求
    mounted() {
      // $('#jinyong').attr("disabled",true);
      // 监听生产计划单输入框，延迟1.5s获取输入框内容
      this.$watch('PlanBill', debounce((NewPlanCode) => {
        this.$emit('PlanBill', NewPlanCode)
        // console.log(NewPlanCode)
        NewPlanCode = {PlanBill: NewPlanCode}
        axios.post('/api/AppAccount/CK_PlanBasic', qs.stringify(NewPlanCode)).then((res) => {
          // console.log(res)
          if (res.data.success === true) {
            if (res.data.data[0]) {
              this.item = res.data.data[0]
              //必须先扫生产计划单，再扫批次码才能显示批次信息，进行出库操作
              // 监听扫码出库输入框，延迟1.5获取输入框内容
              var this_ = this
              this.$watch('BatchStorageId', debounce((NewPutStorageCode) => {
                this.$emit('BatchStorageId', NewPutStorageCode)
                NewPutStorageCode = {BatchStorageId: NewPutStorageCode};
                console.log(NewPutStorageCode)
                axios.post('/api/AppAccount/CK_BatchInfo', qs.stringify(NewPutStorageCode)).then((res) => {
                  console.log(res)
                  if (res.data.success === true) {
                    this_.BatchStorage.push(this.BatchStorageId)
                    this_.lists = this_.lists.concat(res.data.data)
                    //领料数量输入框默认为0
                    this_.num = this_.num.concat(new Array(res.data.data.length).fill(0))
                  }else {
                    this.$message.error('输入超时或该单号没有信息，请重新扫描或输入')
                    setTimeout(() => {
                      window.location.reload();//刷新
                    }, 500)
                  }
                }).catch((err) => {
                  console.log(err)
                })
              }, 1500))
            } else {
              this.$message.error('输入超时或该计划单没有出库信息，请重新扫描或输入')
              setTimeout(() => {
                window.location.reload();//刷新
              }, 500)
            }
          }
        }).catch((err) => {
          console.log(err)
        })
      }, 1500))

      // 监听扫码出库输入框，延迟1.5获取输入框内容
      // this.$watch('BatchStorageId', debounce((NewPutStorageCode) => {
      //   this.$emit('BatchStorageId', NewPutStorageCode)
      //   NewPutStorageCode = {BatchStorageId: NewPutStorageCode};
      //   console.log(NewPutStorageCode)
      //   axios.post('/api/AppAccount/CK_BatchInfo', qs.stringify(NewPutStorageCode)).then((res) => {
      //     console.log(res)
      //     if (res.data.success === true) {
      //       this.BatchStorage.push(this.BatchStorageId)
      //       this.lists = this.lists.concat(res.data.data)
      //       //领料数量输入框默认为0
      //       this.num = this.num.concat(new Array(res.data.data.length).fill(0))
      //     }else {
      //       this.$message.error('输入超时或该单号没有信息，请重新扫描或输入')
      //       setTimeout(() => {
      //         window.location.reload();//刷新
      //       }, 1000)
      //     }
      //   }).catch((err) => {
      //     console.log(err)
      //   })
      // }, 1500))
    },
    methods: {
      //提交对话框
      openDialogbox: function () {
        this.dialogVisible = true
        var sum = 0;
        for (var i = 0; i < this.num.length; i++) {
          sum += this.num[i]
          this.NUM = sum
        }
        var aa = $('#three').val()
        if (this.NUM > aa) {
          alert('领取数量大于未领数量，请重新输入')
          this.dialogVisible = false
        }
      },
      //提交表单信息
      submitForm() {
        var data = {
          OUT_NUM: this.NUM,
          PlanBill: this.PlanBill,
          BatchStorage: [],
        }
        for (var i = 0; i < this.num.length; i++) {
          var c = this.num[i]
          var b = this.BatchStorage[i]
          data.BatchStorage.push(b + '|' + c);
        }
        data.BatchStorage.join(',');
        console.log(data.BatchStorage)
        axios.post('api/AppAccount/CK_Submit', qs.stringify(data)).then((res) => {
          // console.log(res)
          if (res.data.success === true) {
            this.$message.success(res.data.data)
            this.dialogVisible = false
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
      }
    },
  }

</script>

<style scoped>
  .pick {
    margin-top: 15%;
  }

  >>> .el-input {
    padding: 0;
    margin: 0;
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
