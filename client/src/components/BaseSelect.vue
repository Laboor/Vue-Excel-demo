<template>
  <div class="input-group">
    <select
      class="custom-select"
      v-bind:id="selectId"
      v-on:change="$emit('change', $event.target.value)"
      v-bind:value="value"
    >
      <option disabled value="0">
        <slot>请选择</slot>
      </option>
      <option
        v-for="option in options"
        v-bind:value="option.id"
        v-bind:key="option.id"
      >{{ option.name }}</option>
    </select>
    <div class="input-group-append">
      <label class="input-group-text" v-bind:for="selectId">选项</label>
    </div>
  </div>

  <!-- <div class="row">
    <div class="col-sm-12 input-group mb-3">
      <select
        class="custom-select"
        v-bind:id="selectId"
        v-on:change="$emit('change', $event.target.value)"
        v-bind:value="value"
      >
        <option disabled value="0">
          <slot>请选择</slot>
        </option>
        <option
          v-for="option in options"
          v-bind:value="option.id"
          v-bind:key="option.id"
        >{{ option.name }}</option>
      </select>
      <div class="input-group-append">
        <label class="input-group-text" v-bind:for="selectId">选项</label>
      </div>
      <div class="err-tip col-sm-4 align-self-center">
        <span>输入的格式错误</span>
      </div>
    </div>
  </div> -->
</template>


<script>
export default {
  name: 'BaseSelect',
  data: function () {
    return {
      selectId: 'BaseSelect' + this._uid
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: '0'
    },
    options: {
      type: Array,
      required: true,
      default: function () {
        return ['没有选项'];
      }
    }
  }
}
</script>

<style scoped>
.input-group > .input-group-append:not(:last-child) > .input-group-text {
  border-bottom-right-radius: 4px;
  border-top-right-radius: 4px;
}

.err-tip {
  color: red;
  text-align: left;
  font-size: 15px;
}
</style>