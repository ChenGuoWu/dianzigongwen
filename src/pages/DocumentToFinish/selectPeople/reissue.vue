<template>
    <div class="header">
        <header-title>选择人员</header-title>
        <Tree :data = 'baseData' show-checkbox ref="tree" @on-check-change='getCheckedNodes'></Tree>
        <div class="footer">
            <van-button type="info" size="large" class="btn" @click="submit">确定（提交）</van-button>
        </div>
    </div>
</template>
<script>

import {afterReadingItem,appendItem } from '@/api/api'
export default {
    data(){
        return{
            baseData:[],
            zhixiPepole:{
                workItemId:'',
                userCodes:'',
                activityCode:'',
                sign:''
            }
        }
    },
    computed: {
        tiJiaoP(){
            return this.router.docData
        }
    },
    mounted(){
        this.toTree(this.router.peopData.data)
    },
    methods:{        
        // getzhixiPeople(){
        //     afterReadingItem({
        //         params:{
        //             userIds:this.state.userInfo.userId,
        //             tagKey:'bumen'
        //         }
        //     }).then(res=>{
        //         this.baseData = res.data
        //         this.toTree(this.baseData)
        //     })
        // },
        getCheckedNodes(){            
            let a = this.$refs.tree.getCheckedNodes()
            // 存放user的id
            let userid = []
            let username = []
            a.forEach((item,index)=>{
                if(item.type!="dept"){
                    userid.push(item.id)
                    username.push(item.title)
                }
            })
            userid = userid.join(',')
            username = username.join(',')
            this.zhixiPepole.userCodes = userid
            this.seletedPeople = username
        },
        toTree(data) {            
            var data = JSON.parse(JSON.stringify(data).replace(/name/g,"title"));
            // 删除 所有 children,以防止多次调用
            data.forEach(function (item) {
                delete item.children;
            });
            // 将数据存储为 以 id 为 KEY 的 map 索引数据列
            var map = {};
            data.forEach(function (item) {
                map[item.id] = item;
            });
            var val = [];
            data.forEach(function (item) {   
                console.log('a'+item)            
                if(item.pId == 0){
                    item.expand = true
                }
                // 以当前遍历项，的pid,去map对象中找到索引的id
                var parent = map[item.pId];
                // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
                if (parent) {                    
                    (parent.children || ( parent.children = [] )).push(item);
                } else {
                    //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
                    val.push(item);
                }
            });
            this.baseData = val         
        },
        submit(){
            this.$Dialog.confirm({
                title: '标题',
                message: `你确定要提交给（${this.seletedPeople}）吗？`,
            })
            .then(() => {                             
                this.submitDoc()                
            })
            .catch(() => {
                
            });
        },
        submitDoc(){            
            try {
                this.zhixiPepole.workItemId = this.tiJiaoP.workitemId
                this.zhixiPepole.sign = this.router.peopData.sign
                this.zhixiPepole.activityCode = this.router.peopData.nodeCode
                this.zhixiPepole.userCodes = this.state.userInfo.userId
                appendItem(this.zhixiPepole).then(res=>{                    
                    if(res.code == 20000){
                        this.$Toast({ type: 'success', message: '提交成功' });
                        setTimeout(()=>{
                            window.history.go(-2);
                        },550)
                    }else{
                         
                    }                    
                })
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>
<style scoped lang='scss'>
    /deep/ .ivu-tree{
        text-align: left;
        margin:60px 30px 80px 30px;       
    }
    
    /deep/ .ivu-tree ul{
        font-size: 18px !important;
    }
    
    .footer{        
        width: 100%;        
        position: fixed;
        bottom: 0px;
        left: 0;      
        border-radius: 18px;
        background: white
    }
    .btn{
        border-radius: 10px;
    }
    /deep/ .van-button--large{
        width: 90%;
        margin-bottom: 10px;
    }
</style>