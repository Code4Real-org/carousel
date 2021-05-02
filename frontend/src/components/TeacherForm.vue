<!--suppress XmlDuplicatedId -->
<template>
  <div>
  <!-- <div class="x-button">
   <a href="dashboard.html">X</a> -->
  <!--app header-->
  <div class="navigator">
    <div class="left-side">
      <router-link to="/teacher">Return to Dashboard</router-link>
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
      <router-link to="/teacher">x</router-link>
    </div>
    <div id="title">
      <input
          type="text"
          class="title-text"
          placeholder="Enter Title Here"
          v-model="title"
      />
    </div>
    <br />
    <div id="description">
      <input
          type="text"
          class="desc-text"
          placeholder="Form Description"
          v-model="desc"
      />
      <div id="due_date">
        Due Date
        <br /><input type="datetime-local" v-model="dueDate" />
      </div>
    </div>
    <br />
    <div
        id="questions"
        v-for="(questions, index) in questionBoxes"
        :key="questions"
    >
      <!--question-->
      <div class="question-box">
        <input
            type="text"
            class="form-control"
            placeholder="Enter Question Here"
            v-model="questions.question"
        />
      </div>

      <!--choose question type"-->
      <div
          class="question-box choices"
          style="-webkit-text-fill-color: #779fa1"
      >
        <select
            id="choose-question-type"
            class="form-control"
            v-model="questions.type"
        >
          <option>short answer</option>
          <option>long answer</option>
          <option>multiple choice</option>
          <option>checkbox</option>
        </select>
      </div>

      <!--required box-->
      <input type="checkbox" v-model="questions.required" class="required" />

      <!--trash button-->
      <div class="trash_can">
        <div class="trash_symbol" @click="deleteQuestion(index)">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-trash"
              viewBox="0 0 16 16"
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

      <!--short answer text-->
      <div
          id="answer"
          style="height: 40px"
          v-if="questionBoxes[index].type == 'short answer'"
      >
        <div
            id="shortAnswer"
            class="form-control"
            :key="saindex"
            v-for="(shortAnswer, saindex) in questionBoxes[index].shortAnswers"
        >
          <input
              type="text"
              id="short-answer-text"
              class="form-control"
              placeholder="short answer text"
              style="font-family: Arial, Helvetica, sans-serif"
              v-model="shortAnswer.answer"
          />
        </div>
      </div>

      <!--long answer text area-->
      <div id="answer" v-if="questionBoxes[index].type == 'long answer'">
        <div
            id="longAnswer"
            class="form-control"
            :key="laindex"
            v-for="(longAnswer, laindex) in questionBoxes[index].longAnswers"
        >
          <textarea
              id="long-answer-textarea"
              class="form-control"
              placeholder="long answer text"
              v-model="longAnswer.answer"
          ></textarea>
        </div>
      </div>

      <!--multiple choice answer-->
      <div
          id="answer"
          v-else-if="questionBoxes[index].type == 'multiple choice'"
      >
        <div
            id="mcquestions"
            class="mcquestions"
            name="mcquestions"
            :key="mcindex"
            v-for="(mcquestions, mcindex) in questionBoxes[index]
            .multipleChoiceOptions"
        >
          <button
              id="deleting_mc_button"
              class="deleting_mc_button"
              @click="deleteMultipleChoiceOption(index, mcindex)"
          >
            -
          </button>
          <input type="radio" id="radioOption" name="radioOption" value="" />
          <input
              type="text"
              id="radioOptionText"
              name="radioOptionText"
              placeholder="option"
              v-model="mcquestions.moption"
          /><br />
        </div>
        <button
            id="adding_mc_button"
            class="adding_mc_button"
            @click="addNewMultipleChoiceOption(index)"
        >
          add option
        </button>
      </div>

      <!--checkbox answer-->
      <div id="answer" v-else-if="questionBoxes[index].type == 'checkbox'">
        <div
            id="mcquestions"
            class="mcquestions"
            name="mcquestions"
            :key="mcindex"
            v-for="(mcquestions, mcindex) in questionBoxes[index].checkboxOptions"
        >
          <button
              id="deleting_mc_button"
              class="deleting_mc_button"
              @click="deleteCheckboxOption(index, mcindex)"
          >
            -
          </button>
          <input type="checkbox" id="radioOption" name="radioOption" value="" />
          <input
              type="text"
              id="radioOptionText"
              name="radioOptionText"
              placeholder="option"
              v-model="mcquestions.coption"
          /><br />
        </div>
        <button
            id="adding_mc_button"
            class="adding_mc_button"
            @click="addNewCheckboxOption(index)"
        >
          add option
        </button>
      </div>
    </div>
    <!--END: question boxes stack-->
    <!--button to add more questions-->

    <!-- <button class="adding_button" @click="addNewQuestion">+</button> -->

    

    <!--topic choice box-->
    <div id="topicChoiceBox" class="questions">
      <!--minimum question box-->
        <div id="minQuestionBox">
          <p>
             <label>Set minimum questions to be answered: </label>
               <input 
               class = "questionnumber" 
               type="text" 
               v-model= "minQuestions" 
               name="minQuestions" 
               list="minQuestionInput" 
               size="4" 
               maxlength="2"
               />
                  <datalist id="minQuestionInput">
                  </datalist>
          </p>
        </div>
      <p>Set your choice questions here: </p>

      <!--topic label-->
      <!--
        <br /><input
          type="text"
          id="topic-label"
          class="topic-label"
          placeholder="Label (e.g. POAS)"
          v-model="topicChoiceBox.label"
        /> -->

      <!--all choice sets (question + answer)-->
      <div
          id="questionSet"
          :key="questionIndex"
          style="height: 150px"
          v-for="(questionSet, questionIndex) in choiceQuestions"
      >
        <!--question-->
        <input
            type="text"
            id="choice_question"
            class="topic-choice-text"
            placeholder="question (e.g. sentence of significance)"
            v-model="questionSet.question"
        />

        <!--delete choice set button-->
        <button
            id="deleting_mc_button"
            class="deleting_mc_button"
            @click="deleteChoiceQuestionSet(questionIndex)"
        >
          -
        </button>

        <!--dropdown base-->
        <div class="question-box-choices">
          <!--dropdown to select short or long answer to question (for each choice question)-->
          <select
              id="choose-question-type"
              class="form-control"
              v-model="questionSet.type"
              value="questionSet.type"
          >
            <option>short</option>
            <!-- <option>long</option> -->
          </select>
        </div>
        <!--question answer-->

        <!--short answer-->
        <input
            type="text"
            id="choice_question_answer"
            v-if="questionSet.type == 'short'"
            class="topic-choice-text"
            placeholder="answer area"
        />

        <!--long answer-->
        <textarea
            id="choice_question_answer"
            class="topic-choice-textarea"
            v-if="questionSet.type == 'long'"
            placeholder="answer area"
            v-model="questionSet.answer"
        ></textarea>
      </div>
      <!--END: choice set (question+answer) stack-->

      <!--add choice question set button-->
      <button
          id="adding_mc_button"
          class="adding_mc_button"
          @click="addNewChoiceQuestionSet()"
      >
        add question
      </button>
    </div>
    <!--END: topic choice box-->
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
  name: "TeacherForm",
  el: "#form",
  data() {
    return {
      title: "",
      desc: "",
      minQuestions: "3",
      dueDate: getISOStringWithoutSecsAndMillisecs2(new Date()),
      choiceQuestions: [
        {
          type: "short",
          question: "Enter your question here",
        },
      ],
      /*questionBoxes: [
        {

          question: "",
          title: "",
          required: false,
          type: "short answer",
          // short Answer is default question
          shortAnswers: [
            {
              answer: "",
            },
          ],
          longAnswers: [
            {
              answer: "",
            },
          ],
          multipleChoiceOptions: [
            {
              moption: "",
            },
          ],
          checkboxOptions: [
            {
              coption: "",
            },
          ],
        },
      ],*/
    };
  },
  methods: {
    addNewQuestion() {
      this.questionBoxes.push({
        question: "",
        type: "short answer",
        required: true,
        shortAnswers: [
          {
            answer: "",
          },
        ],
        longAnswers: [
          {
            answer: "",
          },
        ],
        multipleChoiceOptions: [
          {
            moption: "",
          },
        ],
        checkboxOptions: [
          {
            coption: "",
          },
        ],
      });
    },
    deleteQuestion(index) {
      this.questionBoxes.splice(index, 1);
    },
    addNewMultipleChoiceOption(index) {
      this.questionBoxes[index].multipleChoiceOptions.push({
        moption: "",
      });
    },
    deleteMultipleChoiceOption(index, mcindex) {
      this.questionBoxes[index].multipleChoiceOptions.splice(mcindex, 1);
    },
    addNewCheckboxOption(index) {
      this.questionBoxes[index].checkboxOptions.push({
        coption: "",
      });
    },
    deleteCheckboxOption(index, mcindex) {
      this.questionBoxes[index].checkboxOptions.splice(mcindex, 1);
    },
    addNewChoiceQuestionSet() {
      this.choiceQuestions.push({
        type: "short",
        question: "",
        answer: "",
      });
    },
    deleteChoiceQuestionSet(questionIndex) {
      if (this.choiceQuestions.length !== 1) {
        this.choiceQuestions.splice(questionIndex, 1);
      }
    },
  }, // methods end
}; // app end
</script>


<style scoped>

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

/* Dropdown button */
.dropdown .drop-button {
  font-size: 16px;
  border: none;
  outline: none;
  color: white;
  padding: 14px 16px;
  background-color: inherit;
  font-family: inherit;
  /* Important for vertical align on mobile phones */
  margin: 0;
  /* Important for vertical align on mobile phones */
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
  height: auto;
  width: 70%;
  background-color: #d1d6e0ff;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1%;
  margin-bottom: 10%;
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
  width: 25px;
  height: 25px;
  background-color: #c95237ff;
  float: right;
  border: 1px solid white;
}
/* letter in the x-button */
.x-button a {
  float: none;
  color: white;
  text-decoration: none;
  display: block;
  text-align: center;
}
/* box for due date */
#due_date {
  width: auto;
  background-color: #779fa1ff;
  float: right;
  margin-right: 0%;
  margin-top: 1%;
  border: 1px solid black;
}
/* box for question */
#questions {
  width: 600px;
  height: 200px;
  background-color: #eeeeeeff;
  margin-left: auto;
  margin-right: auto;
  margin-top: 6%;
  border: 1px solid black;
  display: block;
}
/* box for question-box */
.question-box {
  width: 475px;
  height: 40px;
  background-color: #ede1d1ff;
  margin-left: 1%;
  margin-right: auto;
  margin-top: 1%;
  display: inline-block;
  border: 1px solid black;
}
/* Question input */
.form-control {
  width: 100%;
  border: none;
  box-sizing: border-box;
  border-radius: 4px;
  height: 100%;
  font-size: 100%;
}
/* box for choices */
.choices {
  width: 100px;
  height: 40px;
  background-color: #ede1d1ff;
  float: right;
  margin-right: 1%;
  border: 1px solid black;
}
/* box for answer */
#answer {
  width: 520px;
  height: 125px;
  background-color: #eeeeeeff;
  margin-top: 11%;
  margin-bottom: 1%;
  border: 1px solid black;
}
/* box for requirement */
.required {
  width: 20px;
  height: 20px;
  background-color: #eeeeeeff;
  border: 1px solid black;
  float: right;
  margin-top: 20%;
  margin-bottom: 1%;
  margin-right: 1%;
}
/* Add a purple background color to required button on hover */
.required:hover {
  background-color: #564154ff;
}
/* box for trashcan icon */
.trash_can {
  width: 20px;
  height: 20px;
  background-color: #b7b7b7ff;
  border: 1px solid black;
  float: right;
  margin-top: 20%;
  margin-bottom: 1%;
  margin-right: 1%;
  text-align: center;
}
/* centering trash can icon */
.trash_symbol {
  position: center;
  margin-top: 10%;
}
/* add hovering color for trash-box */
.trash_can:hover {
  background-color: #999999ff;
}
/* box for adding-button */
.adding_button {
  height: 60px;
  width: 100px;
  background-color: #bbb;
  border-radius: 40%;
  border: none;
  display: inline-block;
  margin-top: 5%;
  /* or inline-flex */
  color: #eeeeeeff;
  font-size: 50px;
}
/* add hovering color to adding-button */
.adding_button:hover {
  background-color: #d0c4b4ff;
}

/* topic choice box */
#topicChoiceBox {
  width: 600px;
  background-color: #eeeeeeff;
  margin-left: auto;
  margin-right: auto;
  margin-top: 6%;
  border: 1px solid black;
  display: block;
  padding: 5px;
}

/* label of choice box */
.topic-label {
  width: 200px;
  height: 30px;
  float: left;
  margin-left: 1%;
  margin-bottom: 10px;
  float: bottom;
  border: 1px solid black;
}
/*question and answer text inputs in choice question box*/
.topic-choice-text {
  width: 450px;
  height: 30px;
  margin-left: 1%;
  margin-right: auto;
  margin-top: 3%;
  float: left;
  border: 1px solid black;
}

.topic-choice-textarea {
  width: 450px;
  height: 50px;
  margin-left: 1%;
  margin-right: auto;
  margin-top: 1%;
  border: 1px solid black;
  font-family: Arial, Helvetica, sans-serif;
}

#mcquestions {
  margin-top: 5px;
}

/* adding multiple choice/checkbox button */
.adding_mc_button {
  background-color: white;
  border: 1px solid black;
  color: grey;
  display: flex;
  float: left;
  margin-top: -5%;
  margin-left: 1%;
  margin-right: auto;
}

.adding_mc_button:hover {
  color: #779fa1ff;
}

.question-box-choices {
  -webkit-text-fill-color: #779fa1;
  height: 32px;
  width: 90px;
  float: right;
  background-color: #ede1d1ff;
  margin-right: 1%;
  margin-top: 3%;
  border: 1px solid black;
  text-align: center;
}

.deleting_mc_button {
  float: left;
  margin-top: 3%;
  margin-left: 1%;
}

.submit-button {
  height: 25px;
  width: 100px;
  background-color: #be4b31ff;
  border: 1px solid black;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1%;
  margin-bottom: 1%;
  color: white;
  display: block;
  text-align: center;
}

.questionnumber {
  margin-top: 1%;
  margin-left: 1%;
  text-align: center;
  height: 25px;
  font-size: 12px;
  width: 50px;
  color: #779fa1;
}

</style>
