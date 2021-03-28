<template>

  <!--app header-->
  <div>
  <div class="navigator">
    <div class="left-side">
        <router-link to="/student">Return to Dashboard</router-link>
    </div>
    <div class="right-side">
      <div class="dropdown">
        <button class="drop-button">Your Name</button>
        <div class="button">
          <a href="Settings.html">Settings</a>
          <a href="Help.html">Help</a>
          <a>Log Out</a>
        </div>
      </div>
    </div>
  </div>

  <div id="form">
    <div class="x-button">
      <router-link to="/student">X</router-link>
    </div>
    <div id="title">Title (from Database)</div>
    <br />
    <div id="description">Description (from database)</div>
    <div id="due_date">
      Due Date (is this needed)
      <br /><input disabled type="datetime-local" v-model="dueDate" />
    </div>
    <br />

    <!--option boxes-->
    <div
        id="optionSet"
        v-for="(optionSet, index) in options"
        :key="optionSet"
    >
      <div id="questionSet" v-for="questionSet in optionSet" :key="questionSet">
        <!--question-->
        <div type="text" id="choice_question" class="topic-choice-text">
          Question (from database)
        </div>
        <!--Question Answer-->
        <div>
          <input
            type="text"
            id="choice_question_answer"
            class="topic-choice-answer"
            placeholder="answer area"
          />
        </div>
      </div>

      <!--trash button-->
      <div class="trash_can">
        <div class="trash_symbol" @click="deleteOptionSet(index)">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-trash"
              viewBox="0 0 16 16"
              float="right"
          >
            <path
                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
            />
            <path
                fill-rule="evenodd"
                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
            />
          </svg>
        </div>
      </div>
    </div>
    <div class="adding_button" @click="addNewOptionSet">Add</div>
    <router-link class="submit-button" to="/student">Submit</router-link>
  </div>
  <!--form-->
  </div>
</template>

<script>
function getISOStringWithoutSecsAndMillisecs2(date) {
  const dStr = date.toISOString();
  return dStr.substring(0, dStr.indexOf(":", dStr.indexOf(":") + 1));
}
export default {
  name: "StudentForm",
  el: "#form",
  data() {
    return {
      title: "",
      desc: "",
      dueDate: getISOStringWithoutSecsAndMillisecs2(new Date()),
      options: [
        {
          answer1: "",
          answer2: "",
          answer3: "",
        },
        {
          answer1: "",
          answer2: "",
          answer3: "",
        },
        {
          answer1: "",
          answer2: "",
          answer3: "",
        },
      ],
    };
  },
  methods: {
    addNewOptionSet() {
      this.options.push({
        answer1: "",
        answer2: "",
        answer3: "",
      });
    },
    deleteOptionSet(index) {
      if (this.options.length > 3) {
        this.options.splice(index, 1);
      }
    },
  }, // methods end
}; // app end
</script>


<style scoped>

/* background color */
body {
  background-color: #f5f7e9ff;
  font-family: 'Montserrat', sans-serif;  
}

/* Navbar container */
.navigator {
  overflow: hidden;
  background-color: #000634ff;
  font-family: 'Montserrat', sans-serif;  
}

/* Links inside the navbar left */
.navigator .left-side a {
  float: left;
  font-size: 16px;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

/*Right side of nav bar */
.navigator .right-side {
  float: right;
}

/* The dropdown container */
.dropdown {
  float: left;
  overflow: hidden;
}

/* Add a purple background color to navbar links on hover */
.navigator .right-side a:hover,
.dropdown:hover .drop-button {
  background-color: #666666ff;
}

/*Add a purple background color to nav bar links on hover (left) */
.navigator .left-side a:hover {
  background-color: #666666ff;
}

/* Dropdown content (hidden by default) */
.button {
  display: none;
  position: absolute;
  min-width: 116px;
  background-color: #00235bff;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

/* Links inside the dropdown */
.button a {
  float: none;
  color: white;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
}

/* Show the dropdown menu on hover */
.dropdown:hover .button {
  display: block;
}

/* box for form */
#form {
  width: 850px;
  height: 850px;
  background-color: #e1caabff;
  display: flex;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1%;
  margin-bottom: 1%;
}

/* box for title */
#title {
  width: 600px;
  height: 40px;
  background-color: #eeeeeeff;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2%;
}

/* box for description */
#description {
  width: 600px;
  height: 40px;
  background-color: #eeeeeeff;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10%;
}

/* box for x-button */
.x-button {
  width: 20px;
  height: 20px;
  background-color: #c95237ff;
  float: right;
}

/* letter in the x-button */
.x-button a {
  float: none;
  color: white;
  text-decoration: none;
  display: block;
  text-align: center;
}
.create-form {
  float: right;
  text-align: center;
  width: 60px;
  height: 60px;
  background-color: #d1d6e0ff;
  border-radius: 25px;
  color: white;
  margin-top: 1.5%;
  margin-right: 1%;
  text-decoration: none;
  font-size: 38pt;
}

/* box for question */
#questions {
  width: 600px;
  height: 100px;
  background-color: #eeeeeeff;
  margin-left: auto;
  margin-right: auto;
  margin-top: 5%;
}

/* box for form */
#form {
  height: auto;
  width: 70%;
  background-color: #d1d6e0ff;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1%;
  margin-bottom: 10%;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  border: 1px solid black;
}
/* box for title */
#title {
  width: 90%;
  height: 50px;
  background-color: #eeeeeeff;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2%;
  border: 1px solid black;
  text-align: center;
  vertical-align: middle;
  line-height: 50px;
}
/* Text box for title */
.title-text {
  width: 100%;
  border: none;
  box-sizing: border-box;
  border-radius: 4px;
  height: 100%;
  font-size: 100%;
}
/* box for description */
#description {
  width: 90%;
  height: 50px;
  background-color: #eeeeeeff;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1%;
  border: 1px solid black;
  text-align: center;
  vertical-align: middle;
  line-height: 50px;
}
/* Text box for descrption */
.desc-text {
  width: 100%;
  border: none;
  box-sizing: border-box;
  border-radius: 4px;
  height: 100%;
  font-size: 100%;
}
/* box for x-button */
.x-button {
  width: 20px;
  height: 20px;
  background-color: #c95237ff;
  float: right;
  border: 1px solid black;
  text-decoration: none;
  display: block;
  color: white;
}
/* letter in the x-button */
.x-button a {
  float: none;
  color: white;
  text-decoration: none;
  display: block;
  text-align: center;
}

.x-button:hover {
  background-color: #973620ff;
}
/* box for due date */
#due_date {
  width: auto;
  background-color: #76a5afff;
  float: right;
  margin-right: 1%;
  margin-top: 1.5%;
  border: 1px solid black;
}

/* option */
#optionSet {
  width: 600px;
  height: auto;
  background-color: #eeeeeeff;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1%;
  margin-top: 6%;
  border: 1px solid black;
  display: block;
  border-radius: 5px;
}

/*question and answer text inputs in choice question box*/
.topic-choice-text {
  width: 550px;
  height: 30px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 3%;
  border: 1px solid black;
  text-align: center;
  vertical-align: middle;
  line-height: 30px;
}

.topic-choice-answer {
  width: 550px;
  height: 80px;
  margin-top: 4%;
  border: 1px solid black;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.submit-button {
  height: 25px;
  width: 100px;
  background-color: #be4b31ff;
  border: 1px solid black;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1%;
  color: white;
  display: block;
  text-align: center;
  vertical-align: middle;
  line-height: 25px;
}

.trash_can {
  margin-left: 96.5%;
  margin-top: 1%;
}

.adding_button {
  height: 25px;
  width: 100px;
  margin-left: auto;
  margin-right: auto;
  display: block;
  background-color: #eeeeeeff;
  border: 1px solid black;
  text-align: center;
  vertical-align: middle;
  line-height: 25px;
  margin-bottom: 1%;
}

.adding_button:hover {
  background-color: #e0e0e0ff;
}

.submit-button:hover {
  background-color: #973620ff;
}

</style>
