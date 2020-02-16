<template>
  <div class="input-group">
    <div class="custom-file" style="text-align: left">
      <input
        type="file"
        class="custom-file-input"
        v-bind="$attrs"
        v-bind:id="inputId"
        v-on:change="onChange"
      />
      <label class="custom-file-label" v-bind:for="inputId">{{ fileName }}</label>
    </div>
  </div>
</template>

<script>
function getStrByteLength(val) {
  var str = new String(val);
  var bytesCount = 0;
  for (var i = 0, n = str.length; i < n; i++) {
    var c = str.charCodeAt(i);
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      bytesCount += 1;
    } else {
      bytesCount += 2;
    }
  }
  return bytesCount;
}

export default {
  name: 'BaseInputFile',
  inheritAttrs: false,
  props: {
    defaultText: {
      type: String,
      default: '请上传文件'
    }
  },
  data: function () {
    return {
      inputId: 'BaseInputFile' + this._uid,
      innerText: this.defaultText
    }
  },
  computed: {
    fileName: function () {
      let suffix = this.innerText.slice(this.innerText.lastIndexOf('.'));
      let newText = this.innerText.replace(suffix, '');
      let byte = 0;
      for (let i = 0; i < newText.length; i++) {
        byte += getStrByteLength(newText[i]);
        if (byte > 30) {
          newText = newText.slice(0, i) + '...';
          return newText + suffix;
        }
      }
      return this.innerText;
    }
  },
  methods: {
    onChange: function (event) {
      if (!event.target.files.length) return;
      let file = event.target.files[0];
      this.innerText = file.name;
      this.$emit('input', event.target.files[0]);
    }
  },
  watch: {
    innerText: function () {
      this.$emit('update:defaultText', this.innerText);
    },
    defaultText: function () {
      this.innerText = this.defaultText;
    }
  },
}
</script>

<style scoped>
.custom-file-label::after {
  content: "浏览" !important;
}
</style>