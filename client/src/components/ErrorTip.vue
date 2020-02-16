<template>
  <div id="qqq" name="error-tip">123</div>
</template>

<script>
import Vue from 'vue';

Vue.mixin({
  // created: function () {
  //   let validate = this.$options.validate;
  //   if (validate) {
  //     console.log(this)
  //   }
  // },
  directives: {
    validate: {
      bind: function (el, binding, { context }) {
        // if (el.getAttribute('name') != 'error-tip') return;
        // let regExp = new RegExp(context.$options.validate.email);
        console.log(binding.arg);
        console.log(binding.expression);
        console.log(binding.value);
        console.log(context.$parent.$options);
        console.log(context.$options.validate.email);
        // console.log(regExp.test(binding.value));

        // el.addEventListener('blur', () => {
        //   console.log(binding.expression);
        //   console.log(binding.value);
        //   console.log(regExp.test(binding.value));

        // })

        // el.innerHTML = this.$options.validate.message;
      },
      componentUpdated: function (el, binding, { context }) {
        let regExp = new RegExp(context.$options.validate.email);
        el.addEventListener('blur', () => {
          console.log(binding.expression);
          console.log(binding.value);
          console.log(regExp.test(binding.value));
        })
      }
    },
    errTip: {

    }
  }
});

export default {
  name: 'ErrorTip',
  data: function () {
    return {
      msg: ''
    }
  }
}
</script>

<style scoped>
</style>