<template>
  <div>
    <img alt="Vue logo" src="../assets/logo.png">
    <upload-form/>
  </div>
</template>

<script>
// @ is an alias to /src
import UploadForm from '@/components/UploadForm.vue'

export default {
  name: 'Import',
  components: {
    UploadForm
  }
}
</script>
