<template>
  <div>
    <div v-if="currentFile" class="progress">
      <div
        class="progress-bar progress-bar-info progress-bar-striped"
        role="progressbar"
        :aria-valuenow="progress"
        aria-valuemin="0"
        aria-valuemax="100"
        :style="{ width: progress + '%' }"
      >
        {{ progress }}%
      </div>
    </div>

    <label class="btn btn-default">
      <input type="file" ref="file" @change="selectFile" />
    </label>

    <label>Class Period: 
       <vue-numeric-input  v-model="classPeriod" :min="1" :max="6" :step="1"></vue-numeric-input>
    </label>

    <button class="btn btn-success" :disabled="!selectedFiles" @click="upload()">
      Upload
    </button>



    <div class="alert alert-light" role="alert">{{ message }}</div>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import VueNumericInput from 'vue-numeric-input';
import UploadService from "../services/UploadFileService";

export default {
  name: "upload-file",
  components: {
    VueNumericInput
  },
  data() {
    return {
      selectedFiles: undefined,
      currentFile: undefined,
      classPeriod: 1,
      progress: 0,
      message: "",
      fileInfos: []
    };
  },
  computed: {
    ...mapState(['activeAssignment'])
  },
  methods: {
    selectFile() {
      this.selectedFiles = this.$refs.file.files;
    },
    upload() {
      this.progress = 0;
      this.currentFile = this.selectedFiles.item(0);
      UploadService.upload(this.currentFile, this.activeAssignment.assignmentId, this.classPeriod, event => {
        this.progress = Math.round((100 * event.loaded) / event.total);
      })
        .then(response => {
          this.message = response.data.message;
          console.log(this.message);
        })
        .catch(() => {
          this.progress = 0;
          this.message = "Could not upload the file!";
          this.currentFile = undefined;
        });
      this.selectedFiles = undefined;
    }
  },
  mounted() {

  }
};
</script>