<template>
  <div class="p-modal">
    <div class="p-container">
      <a @click="$emit('close')">close</a>
    <div class="row">
    <div class="col-lg-8">
      <h4>Teachers List</h4>
      <div>
        <b-table striped hover sticky-header="600px" :items="teachers" :fields="fields"
          :select-mode="selectMode"
          selectable
          @row-selected="onTeacherSelected" >
          <!-- A virtual column -->
          <template #cell(index)="data">
            {{ data.index + 1 }}
          </template>
        </b-table>
      </div>

      <b-button class="m-3 btn btn-sm btn-danger" @click="removeAllTeachers">
        Remove All
      </b-button>
    </div>
    <div class="col-lg-4">
      <div v-if="currentTeacher">
        <h4>Teacher</h4>
        <div>
          <label><strong>Name:</strong> {{ currentTeacher.firstName }} {{ currentTeacher.lastName }}</label>
        </div>
        <div>
          <label><strong>Gmail:</strong> {{ currentTeacher.email }}</label>
        </div>
      </div>
      <div v-else>
        <br>
        <p>Please click on a Teacher...</p>
      </div>
    </div>
  </div>
  </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TeacherDataService from "../services/TeacherDataService"

export default {
  name: "teachers-list",
  components: {
    
  },
  data() {
    return {
      fields: ['index', 'firstName', 'lastName', 'username'],
      selectMode: 'single',
      teachers: [],
      currentTeacher: null
    };
  },
  computed: {
    ...mapState(['activeSchool'])
  },
  methods: {
    retrieveTeachers(schoolId) {
      TeacherDataService.getAllTeachers(schoolId)
        .then(response => {
          this.teachers = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    refreshList() {
      this.retrieveTeachers(this.activeAssignment.assignmentId);
      this.currentTeacher = null;
    },

    onTeacherSelected(items) {
      this.currentTeacher = items[0];
    },

    removeAllTeachers() {
      this.$confirm("All registered teachers will be removed from this assignment.", "Are you sure?", 'warning').then(() => {
        TeacherDataService.deleteAll()
          .then(response => {
            console.log(response.data);
            this.refreshList();
          })
          .catch(e => {
            console.log(e);
          });
      }).catch(err => {
        console.log(err);
      });
    }
  },
  mounted() {
    // ToDo: currently hard coded to American High
    this.retrieveTeachers(1);
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