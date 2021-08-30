<template>
  <div class="p-modal">
    <div class="p-container">
      <a @click="$emit('close')">close</a>

      <h4>Students List</h4>
      <div>
        <b-table striped hover sticky-header="600px" :items="students" :fields="fields"></b-table>
      </div>

      <button class="m-3 btn btn-sm btn-danger" @click="removeAllStudents">
        Remove All
      </button>

    <div class="col-md-6">
      <div v-if="currentStudent">
        <h4>Student</h4>
        <div>
          <label><strong>Name:</strong></label> {{ currentStudent.username }}
        </div>
        <div>
          <label><strong>Gmail:</strong></label> {{ currentStudent.gid }}
        </div>

        <router-link :to="'/students/' + currentStudent.id" class="badge badge-warning">Edit</router-link>
      </div>
      <div v-else>
        <br />
        <p>Please click on a Student...</p>
      </div>
    </div>

  <div>
    <h5>Import a student roster</h5>
    <upload-file :activeAssignment="activeAssignment"></upload-file>
  </div>

  </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import StudentDataService from "../services/StudentDataService"
import UploadFile from "../components/UploadFile"

export default {
  name: "students-list",
  components: {
    UploadFile
  },
  data() {
    return {
      fields: ['firstName', 'lastName', 'username'],
      students: [],
      currentStudent: null,
      currentIndex: -1,
      name: ""
    };
  },
  computed: {
    ...mapState(['activeAssignment'])
  },
  methods: {
    retrieveStudents(assignmentId) {
      StudentDataService.getAll(assignmentId)
        .then(response => {
          this.students = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    refreshList() {
      this.retrieveStudents();
      this.currentStudent = null;
      this.currentIndex = -1;
    },

    setActiveStudent(student, index) {
      this.currentStudent = student;
      this.currentIndex = index;
    },

    removeAllStudents() {
      StudentDataService.deleteAll()
        .then(response => {
          console.log(response.data);
          this.refreshList();
        })
        .catch(e => {
          console.log(e);
        });
    },
    
    searchName() {
      StudentDataService.findByName(this.name)
        .then(response => {
          this.tutorials = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    closeStudentsList() {
      this.students = []

      this.$emit('close')
    }
  },
  mounted() {
    this.retrieveStudents(this.activeAssignment.assignmentId);
  }
};
</script>

<style>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
</style>
