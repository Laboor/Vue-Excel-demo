<template>
  <div class="form-area">
    <form v-on:submit.prevent="onSubmit">
      <div class="row align-items-center my-form-control">
        <base-select
          class="col-sm-8"
          v-bind:options="cities"
          v-model="citySelected"
          v-on:change="cityChange"
        >地市局选择</base-select>
        <span class="err-tip col-sm-4" v-show="!cityVaild">未选择地市局</span>
      </div>

      <div class="row align-items-center my-form-control">
        <base-select
          class="col-sm-8"
          v-bind:options="branches"
          v-model="branchSelected"
          v-on:change="branchChange"
        >线路选择</base-select>
        <span class="err-tip col-sm-4" v-show="!branchVaild">未选择线路</span>
      </div>

      <div class="row align-items-center my-form-control">
        <div class="col-sm-8">
          <button type="submit" class="btn btn-primary btn-block">导出</button>
        </div>
        <span
          class="col-sm-4"
          v-bind:class="[downloadStatus ? 'success-tip' : 'err-tip']"
          v-show="isDisplayMsg"
        >{{ messageDisplay }}</span>
      </div>
    </form>
  </div>
</template>


<script>
import BaseSelect from './BaseSelect';
import Api from '../settings/apiConfig';
import fileSaver from 'file-saver';


export default {
  name: 'DownloadForm',
  components: {
    BaseSelect
  },
  data: function () {
    return {
      cities: [],
      branches: [],
      citySelected: '0',
      branchSelected: '0',
      firstVerify: false,
      downloadStatus: false,
      isDisplayMsg: false,
      downloadResultMsg: ''
    };
  },
  computed: {
    cityVaild: function () {
      if (this.citySelected == '0' && this.firstVerify) return false
      return true;
    },
    branchVaild: function () {
      if (this.branchSelected == '0' && this.firstVerify) return false
      return true;
    },
    formValid: function () {
      return this.cityVaild && this.branchVaild;
    },
    messageDisplay: {
      get: function () {
        return this.downloadResultMsg;
      },
      set: function (msg) {
        this.downloadResultMsg = msg;
        this.isDisplayMsg = true;
        let timer = setTimeout(() => {
          this.isDisplayMsg = false;
          clearTimeout(timer);
        }, 4000);
      }
    }
  },
  created() {
    this.axios.get(Api.cityInfoApi)
      .then(res => {
        this.cities = res.data.data;
      })
      .catch(err => {
        console.error(err);
      });
  },
  methods: {
    onSubmit: function () {
      this.firstVerify = true;
      if (this.formValid) {
        this.axios.get(Api.exportApi)
          .then(res => {
            let buffer = new Uint8Array(res.data.data.data);
            let blob = new Blob([buffer], { type: 'application/octet-stream' });
            fileSaver.saveAs(blob, "变压器清单.xlsx");
            this.isShowMsg = true;
            this.downloadStatus = true;
            this.messageDisplay = '导出成功';
            console.log(res);
          })
          .catch(err => {
            this.isShowMsg = true;
            this.downloadStatus = false;
            this.messageDisplay = '导出失败';
            console.log(err);
          })
      } else {
        console.log('请完善表单信息！');
      }
    },
    cityChange: function (e) {
      this.branchSelected = '0';
      this.axios.get(Api.branchInfoApi, {
        params: {
          cityId: e
        }
      })
        .then(res => {
          this.branches = res.data.data;
        })
        .catch(err => {
          console.log(err.response);
        });
    },
    branchChange: function (e) {
      console.log(e);
    }
  }
}
</script>

<style scoped>
.form-area {
  width: 600px;
  margin: 100px calc(50% - 195px);
}

.err-tip {
  color: red;
  text-align: left;
  font-size: 15px;
}

.success-tip {
  color: rgb(19, 150, 19);
  text-align: left;
  font-size: 15px;
}

.my-form-control {
  margin-bottom: 1em;
}
</style>