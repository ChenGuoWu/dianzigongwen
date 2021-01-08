<template>
    <div class="main">
        <list 
            :loading='loading'
            :doc_xinxi='doc_xinxi'
            :zwfile='zwfile'
            :oa_comment='oa_comment'
            :receive_note="receive_note"
            :submit_note="submit_note"
            :zhengXunOpinion="zhengXunOpinion"
            :feedBackOpinion="feedBackOpinion"
            :mobileLeaderOpinion="mobileLeaderOpinion"
        ></list>
        
        <footer>
            <van-skeleton title :row="2" :loading="btloading"/>
            <div class="btn">
                <van-button type="info" loading-text="加载中..." v-showBtn="{name:'bu_fa',data:btnData}" @click="reissue('bu_fa')">补发</van-button>
                <van-button type="danger" loading-text="加载中..." v-showBtn="{name:'shou_hui',data:btnData}" @click="backTo('shou_hui')">收回</van-button>
                <van-button type="info" loading-text="加载中..." v-showBtn="{name:'zhi_xi',data:btnData}" @click="zhiXi"></van-button>                                     
            </div>
        </footer>
        <!-- bufa -->
        <van-dialog v-model="dialog" title="选择人员" show-cancel-button @confirm='confirm' @cancel='cancel'>
            <van-radio-group v-model="name" class="group">
                <div v-for="(item,index) in radio" :key="index">
                    <van-radio :name=index @click='change(item)'>{{item.nodeName}}</van-radio>     
                </div>
            </van-radio-group>
        </van-dialog>
        <!-- shouhui -->
        <!-- <van-dialog v-model="dialogA" title="选择人员" show-cancel-button @confirm='confirmA' @cancel='cancelA'>
            <van-radio-group v-model="nameA" class="group">
                <div v-for="(item,index) in radio" :key="index">
                    <van-radio :name=index @click='change(item)'>{{item.nodeName}}</van-radio>     
                </div>
            </van-radio-group>
        </van-dialog>    -->
    </div>
</template>
<script>
import {reissueUserTree,recoverUserTree } from '@/api/api'
import list from '@/pages/common/list.vue'
import {minxin} from '@/common/mixins/getList.js'
export default {
    mixins:[minxin],
    data(){
        return{
            dialog:false,
            dialogA:false,
            radio:[],
            radioA:[],
            name:0,
            nameA:'',
            peopleData:[]
        }
    },
    computed:{    
               
    },
    components:{list},
    mounted(){      
    },
    methods:{
        confirm(){            
            //回到最初的起点
            this.peopleData = this.radio[this.name]
            this.name = 0
            this.$router.push({
                path:'/DocumentToFinish/selectPeople/backto',
                query:{
                    peopData:this.peopleData,
                    docData:this.router,
                    type:this.typename
                }
            })
        },
        // confirmA(){
        //     console.log(1)
        //     //回到最初的起点
        //     this.peopleData = this.radio[this.name]            
        //     this.name = 0
        //     this.$router.push({
        //         path:'/DocumentToFinish/selectPeople/backto',
        //         query:{
        //             peopData:this.peopleData,
        //             docData:this.router
        //         }              
        //     })
        // },
        zhiXi(){
            this.$router.push({
                path:'/DocumentToDo/selectPeople/zhixi',
                query:this.router   
            })
        },
        backTo(e){
            this.typename = e                     
            recoverUserTree({
                params:{
                    'workItemId':this.router.workitemId,
                    'userId':this.state.userInfo.userId,
                    'departId':this.state.userInfo.user.dept.parentId
                }
            }).then(res=>{
                if(res.data.length==0){
                    this.$Toast('暂无人员数据')
                }else{
                    this.dialog = true
                }
                this.radio = res.data
            }) 
        },
        cancel(){
            //回到最初的起点
            this.name = 0
        },
        cancelA(){
            //回到最初的起点
            this.nameA = 0
        },
        change(e){
            this.peopleData = e                     
        },   
        reissue(e){            
            this.typename = e
            reissueUserTree({
                params:{
                    'workItemId':this.router.workitemId,
                    'userId':this.state.userInfo.userId,
                    'departId':this.state.userInfo.user.dept.parentId   
                }
            }).then(res=>{
                if(res.data.length==0){
                    this.$Toast('暂无人员数据')
                }else{
                    this.dialog = true
                }
                this.radio = res.data
            })      
        },       
    }
}
</script>
<style scoped>
    @import '../common/list.css';	
</style>