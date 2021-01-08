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
    </div>
</template>
<script>
import {getDocumentDeail,getWorkItemOptions } from '@/api/api'
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
}
</script>
<style scoped>
    @import '../common/list.css';	
</style>