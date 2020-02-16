<template>
  <div>
    <img alt="Vue logo" src="../assets/logo.png">
    <download-form/>
  </div>
</template>

<script>
// @ is an alias to /src
import DownloadForm from '@/components/DownloadForm.vue'

export default {
  name: 'Export',
  components: {
    DownloadForm
  }
}
</script>
