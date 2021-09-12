<template>
  <div class="p-modal">
    <div class="p-container">
      <a @click="$emit('close')">close</a>
    <div class="row">
    <div class="col-lg-8">
      <h4>POAS Already Taken</h4>
      <div>
        <b-table striped hover sticky-header="600px" :items="poases" :fields="fields"
          :select-mode="selectMode"
          selectable
          @row-selected="onPoasSelected" >
          <!-- A virtual column -->
          <template #cell(index)="data">
            {{ data.index + 1 }}
          </template>
        </b-table>
      </div>

    </div>
    <div class="col-lg-4">
      <div v-if="currentPoas">
        <h4>Student</h4>
        <div>
          <label><strong>Name:</strong></label> {{ currentPoas.username }}
        </div>
      </div>
      <div v-else>
        <br />
        <p>Please click on a POAS...</p>
      </div>
    </div>
  </div>

  </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PoasDataService from "../services/PoasDataService"

export default {
  name: "poases-list",
  data() {
    return {
      fields: ['index', 'firstName', 'middleName', 'lastName'],
      selectMode: 'single',
      poases: [],
      currentPoas: null
    };
  },
  computed: {
    ...mapState(['activeAssignment'])
  },
  methods: {
    retrievePoases(assignmentId) {
      PoasDataService.getAssigned(assignmentId)
        .then(response => {
          this.poases = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    refreshList() {
      this.retrievePoases(this.activeAssignment.assignmentId);
      this.currentPoas = null;
    },

    onPoasSelected(items) {
      this.currentPoas = items[0];
    }
  },
  mounted() {
    this.retrievePoases(this.activeAssignment.assignmentId);
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