<template>
  <div class="pdf">
    <header-title>流程预览</header-title>
    <iframe :src="pdfUrl" id="iframe"></iframe>  
    <!-- <div v-html="src"></div> -->
  </div>
</template>
<script>
import { viewUrl } from "@/api/api";
export default {
  name: "Pdf",

  data() {
    return {
      pdfUrl: ""
    };
  },
  mounted() {
    this.getInstanceDetailapi();
  },
  methods: {
    getInstanceDetailapi() {
        let e = this.$route.params;
        this.pdfUrl = viewUrl + "/document/getInstanceDetail?instanceId=" + e.instanceId + "&isMobile=true"+'&name='+e.biaoTi
    //   const xhr = new XMLHttpRequest();      
    //   xhr.open(
    //     "get",
    //     viewUrl + "/document/getInstanceDetail?instanceId=" + e.instanceId + "&isMobile=true"+'&name='+e.biaoTi
    //   );
    //   xhr.setRequestHeader("token", this.$store.state.userToken);

    //   xhr.onloadend = e => {
    //     var iframe = document.getElementById('iframe')
    //     this.src = xhr.response
    //     // iframe.contentWindow.document.write()
    //   };
    //   xhr.send();
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
    height: 1000px;
    border: none!important;
  }
</style>
