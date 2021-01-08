<template>
  <div class="main">
    <header-title>会签反馈</header-title>
    <div class="checkAll">
      <div v-if="checkAll" @click="changCheckAllTrue">全选</div>
      <div v-else @click="changCheckAllFalse">取消</div>
    </div>
    <div class="main-list">
      <ul>
        <li>
          <van-checkbox-group v-model="result" ref="checkboxGroup">
            <div v-for="(item, index) in res" :key="index" class="lineTitle">
              <van-checkbox :name="item" @click="cehsi(item)"
                >{{ item.approvalUserName }}（{{ item.displayName}}）:{{item.approvalOpinionInput}}</van-checkbox>
              <div class="time">
                <div>{{ item.approvalDepartment }}</div>
                <div>{{ item.approvalDate }}</div>
              </div>
            </div>
          </van-checkbox-group>
        </li>
      </ul>
    </div>
    <div>
      <van-radio-group v-model="radio">
        <van-radio name="1" shape="square" @click="selected($event)">会签反馈意见</van-radio>
      </van-radio-group>
      <div class="space">
        <textarea name="" id="textarea" v-model="textarea" placeholder="请输入填写意见"></textarea>
      </div>
    </div>
    <footer>
      <van-button type="info" @click="isOk('yes')">同意</van-button>
      <van-button type="info" @click="isOk('no')">不同意</van-button>
    </footer>
  </div>
</template>
<script>
import {feedBackOaOpinion, carsoaSubmit} from '@/api/api'
// import { delete } from 'vue/types/umd';
export default {
  data() {
    return {
      result: [],
      checkAll: true, //控制全选默认为全选
      value: true,
      radio: "1",
      istrue: 1,
      textarea: "",
      saveOpinion: {
        documentId: "",
        instanceId: "",
        workitemId: "",
        activityCode: "",
        displayName: window.displayName,
        approvalUserId: "",
        approvalOpinion: "",
        approvalOpinionInput: "",
        waitDoOrRead: "ToDo",
        approvalOpinionImgId: "",
        counterSignDept: "",
        counterSignDeptId: "",
        approvalUserName: "",
        approvalDepartment: "",
        approvalDepartmentInfo: "",
        approvalDepartmentId: "",
        approvalPosition: "",
        departSortNumber: "",
        departPostSortNumber: "",
        attachmentFileId: "",
        attachmentFileName: "",
        commentBath: "",
        optionalFeedbackComment: "",
        textField: "",
        textFieldJson: "",
        state: "0",
        mobileOrPc: "mobile",
        ids: "",
        choice: "",
        counterSignIsAgree: "",
        isAgree: 0,
        departLevel: "",
        approvalDate: "",
        approvalUserId:''
      }
    };
  },
  computed: {
    res() {
      return this.$route.params.result;
    },
    userInfos() {
      return this.$store.state.userInfo;
    },
  },
  mounted() {
    //数据深加工实现自动更换全选取消
    this.$route.params.result.forEach(item=>{
      item.checked=false;//默认fasle不选中
    })
    console.log( this.res)
  },
  components: {
    Checkbox: "van-checkbox",
    CheckboxGroup: "van-checkbox-group"
  },
  methods: {
    isOk(e) {
      let array = []
      this.result.forEach(element => {
        array.push(element.objectId)
      });
      // if(!array.join(',')){
      //   this.saveOpinion.ids = null
      //   // delete this.saveOpinion.ids
      // }else{
      //   this.saveOpinion.ids = array.join(',')
      // }
      console.log('user',user)
      this.saveOpinion.ids = array.join(',')
      let p = this.$route.params.query
      let user = this.state.userInfo.user     
      let basicDept = this.state.basicDept
      this.saveOpinion.documentId = p.documentId
      this.saveOpinion.workitemId = p.workitemId
      this.saveOpinion.approvalUserName = user.userName
      this.saveOpinion.approvalDepartmentInfo = user.departName
      this.saveOpinion.approvalDepartment = user.dept.deptName
      this.saveOpinion.departPostSortNumber = user.sortNumber
      this.saveOpinion.instanceId = p.instanceId
      this.saveOpinion.approvalUserId = this.userInfos.userId
      this.saveOpinion.isAgree = this.istrue
      this.saveOpinion.activityCode = p.activityCode
      this.saveOpinion.approvalOpinionInput = this.textarea
      this.saveOpinion.waitDoOrRead = 'ToDo'
      this.saveOpinion.textFieldJson = this.textfildjson
      this.saveOpinion.departSortNumber = basicDept.sortNumber
      this.saveOpinion.approvalDepartmentId = basicDept.objectId
      basicDept.deptLevel === null?this.saveOpinion.departLevel = 1:this.saveOpinion.departLevel = basicDept.departLevel
      this.istrue ? this.saveOpinion.choice = true : this.saveOpinion.choice = false
      console.log(this.saveOpinion)
      if(e == 'yes'){
        this.$Dialog.confirm({
          title: "标题",
          message: "是否同意反馈"
        }).then(() => {
            // on confirm
            this.feedBackOaOpinionApi()
        }).catch(() => {
            // on cancel
            // this.saveOpinion.state = 0
            // this.feedBackOaOpinionApi()
        });
      }else{
        
        this.$Dialog.confirm({
          title: "标题",
          message: "是否不同意反馈"
        }).then(() => {
            // on confirm
            this.saveOpinion.state = 0
            this.saveOpinion.isAgree = 0
            this.feedBackOaOpinionApi()
        }).catch(() => {
            // on cancel
        });
      }
      
    },
    feedBackOaOpinionApi(){
      feedBackOaOpinion(this.saveOpinion).then(res=>{
        if(res.code == 20000){
            this.carsoaApi()
              // this.$Toast({ type: 'success', message: '提交成功' });
              // setTimeout(()=>{
              //     window.history.back(-1);
              // },550)
          }else{
                
          } 
      })
    },
    changCheckAllTrue() {
      this.checkAll = !this.checkAll;
      this.$refs.checkboxGroup.toggleAll(true);
      //深加工的数据都为true
      this.res.forEach(item=>{
        item.checked=true
      })
    },
    changCheckAllFalse() {
      this.checkAll = !this.checkAll;
      this.$refs.checkboxGroup.toggleAll();
      //深加工的数据都为false
      this.res.forEach(item=>{
        item.checked=false
      })
    },
    cehsi(item) {
      item.checked=!item.checked;
      //显示取消S
        this.checkAll=false
      this.res.forEach(item=>{
        if(item.checked==false){
          this.checkAll=true;
          return;
        }
        
      })
    },
    selected(e) {

      this.istrue = !this.istrue;
      console.log(this.istrue)
      this.istrue ? (this.radio = "1",this.istrue = 1,this.saveOpinion.choice = true) : (this.radio = "-1",this.istrue = 0, this.saveOpinion.choice = false);
    },
    carsoaApi(){
      carsoaSubmit(this.$route.params.endp).then(res => {
          if (res.code == 20000) {
            this.$Toast({ type: "success", message: "提交成功" });
            setTimeout(() => {
              window.history.go(-2);
            }, 750);
          } else {
          }
        });
    },
  }
};
</script>
<style scoped>
.checkAll {
  position: absolute;
  right: 13px;
  top: 2%;
  /* padding-left: 15px; */
  z-index: 32323;
  color: white;
  font-size: 12px;
}
.time {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  align-items: baseline;
}
.lineTitle {
  border-bottom: 1px solid #f1f1f1;
}
.main {
  padding: 8px;
}
.main-list {
  height: 300px;
  overflow: auto;
}
#textarea {
  width: 100%;
  height: 130px;
  border: 1px solid rgb(241, 241, 241);
}
.space {
  padding: 8px;
}
footer {
  display: flex;
  justify-content: space-evenly;
}
.van-button {
  width: 140px;
}
</style>
