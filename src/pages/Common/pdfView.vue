<template>
  <div class="pdf">
    <header-title>文件预览</header-title>
    <iframe :src="pdfUrl" id="iframe"></iframe>  
  </div>
</template>
<script>
import { onlinePreview,viewUrl } from "@/api/api";
export default {
  name: "Pdf",  
  data() {
    return {
      pdfUrl: ""
    };
  },
  mounted() {
    this.getOnlinePreview();
  },
  methods: {
    getOnlinePreview() {
      let that = this
      let userinfo = this.state.userInfo.user.userName+this.state.userInfo.user.officePhone
      let id = this.$route.params.id    
      const xhr = new XMLHttpRequest();
				xhr.responseType = 'blob';				
				xhr.open('get', viewUrl+'/preview/onlinePreview?fileId=' + id +
				  '&watermarkText='+userinfo )
				xhr.setRequestHeader("token", that.$store.state.userToken)
				xhr.onloadend = e => {
          this.pdfUrl ='./static/PDF/web/viewer.html?file=' + window.URL.createObjectURL(xhr.response)
				}
				xhr.send();
    }
  }
};
</script>
<style scope>
  .pdf{
    height: 100%; 
    width: 100%;
  }
  #iframe{
    width: 100%;
    height: 600px; 
    border: none!important;
  }
</style>
