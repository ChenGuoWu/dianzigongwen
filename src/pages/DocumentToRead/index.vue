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
        ></list>
        <footer>
            <van-skeleton title :row="2" :loading="btloading"/>
            <div class="btn">
                <van-button type="danger" loading-text="加载中..." v-showBtn="{name:'yue_bi',data:btnData}" @click="yuebi"></van-button>
                <van-button type="info" loading-text="加载中..." v-showBtn="{name:'zhi_xi',data:btnData}" @click="zhixi"></van-button>                                      
            </div>
        </footer>
    </div>
</template>
<script>
import {afterReadingItem } from '@/api/api'
import list from '@/pages/common/list.vue'
import {minxin} from '@/common/mixins/getList.js'
export default {
    mixins:[minxin],
    data(){
        return{
            
        }
    },
    computed:{    
               
    },
    components:{list},
    mounted(){
        
    },
    methods:{
        yuebi(){            
            this.$Dialog.confirm({
                title: '标题',
                message: `你确定要阅毕吗？`,
            })
            .then(() => {                             
                this.api()                
            })
            .catch(() => {
                
            });           
        },
        zhixi(){
            this.$router.push({
                path:'/DocumentToDo/selectPeople/zhixi',
                query:this.router              
            })
        },
        api(){
            let a = {
                workItemId:this.router.workitemId,
                userCode:this.state.userInfo.userId
            }
            afterReadingItem(a).then(res=>{
                if(res.code == 20000){
                    this.$Toast({ type: 'success', message: '提交成功' });
                    setTimeout(()=>{
                        window.history.back(-1);
                    },550)
                }else{   
                }
            })
        }
    }
}
</script>
<style scoped>
    @import '../common/list.css';	
</style>