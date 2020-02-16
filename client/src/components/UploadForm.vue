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
        <base-input-file
          class="col-sm-8"
          accept=".xls*"
          v-on:input="upload"
          defaultText="上传Excel附件"
        />
        <span class="err-tip col-sm-4" v-show="!fileVaild">未上传附件</span>
        <span class="err-tip col-sm-4" v-show="!fileTypeVaild">附件格式错误</span>
      </div>

      <div class="row align-items-center my-form-control">
        <div class="col-sm-8">
          <button type="submit" class="btn btn-primary btn-block">导入</button>
        </div>
        <span
          class="col-sm-4"
          v-bind:class="[uploadStatus ? 'success-tip' : 'err-tip']"
          v-show="isDisplayMsg"
        >{{ messageDisplay }}</span>
      </div>
    </form>
  </div>
</template>


<script>
import BaseSelect from './BaseSelect';
import BaseInputFile from './BaseInputFile';
import Api from '../settings/apiConfig';

const FILE_TYPE = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

export default {
  name: 'UploadForm',
  components: {
    BaseSelect,
    BaseInputFile
  },
  data: function () {
    return {
      cities: [],
      branches: [],
      citySelected: '0',
      branchSelected: '0',
      firstVerify: false,
      file: null,
      isTruefileType: true,
      uploadStatus: false,
      isDisplayMsg: false,
      uploadResultMsg: ''
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
    fileVaild: function () {
      if (!this.file && this.firstVerify) return false
      return true;
    },
    fileTypeVaild: function () {
      if (!this.isTruefileType) return false;
      return true;
    },
    formValid: function () {
      return this.cityVaild && this.branchVaild && this.fileVaild && this.fileTypeVaild;
    },
    messageDisplay: {
      get: function () {
        return this.uploadResultMsg;
      },
      set: function (msg) {
        this.uploadResultMsg = msg;
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
        let formData = new FormData();
        formData.set('cityId', this.citySelected);
        formData.set('branchId', this.branchSelected);
        formData.set('file', this.file);
        this.axios.post(Api.uploadApi, formData)
          .then(res => {
            this.isShowMsg = true;
            this.messageDisplay = '上传成功';
            this.uploadStatus = true;
            console.log(res);
          })
          .catch(err => {
            this.isShowMsg = true;
            this.messageDisplay = '上传失败';
            this.uploadStatus = false;
            console.log(err.response.data);
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
    },
    upload: function (e) {
      this.file = e;
      console.log(e);
      if (!FILE_TYPE.includes(e.type)) {
        this.isTruefileType = false;
        return;
      } else {
        this.isTruefileType = true;
        return;
      }
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