<template>
  <div class="c-modal">
    <div class="c-container">
      <a @click="$emit('close')">close</a>

  <div>
    <h5>Import a student roster</h5>
    <upload-file :activeAssignment="activeAssignment"></upload-file>
  </div>

  </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UploadFile from "../components/UploadFile"

export default {
  name: "students-import",
  components: {
    UploadFile
  },
  data() {
    return {
      students: []
    };
  },
  computed: {
    ...mapState(['activeAssignment'])
  },
  methods: {

  }
};
</script>