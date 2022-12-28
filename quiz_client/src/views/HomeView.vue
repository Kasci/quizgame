<template>
  <div class="flex flex-col items-center">
    <div class="text-2xl m-5 text-blue-800 scale-150">QuizMaster</div>
    <input type="text" class="m-5 rounded text-black text-center scale-150" v-model="quizId" @keyup.enter="enterQuiz"/>
    <button class="border rounded scale-150 m-5 px-5" @click="enterQuiz">Enter</button>
    <div class="text-red-500" v-if="errorMessage != ''">{{errorMessage}}</div>
  </div>
</template>

<script lang="ts">
  export default {
    data() {
      return {
        quizId: "",
        errorMessage: ""
      }
    },
    methods: {
      getQuizPath() {
        if (this.quizId.startsWith("!")) {
          return "/quiz/manage/" + this.quizId.substring(1);
        } else if (this.quizId.startsWith("@")) {
          return "/quiz/overview/" + this.quizId.substring(1);
        } else {
          return "/quiz/lobby/" + this.quizId
        }
      },
      enterQuiz() {
        if (this.quizId == "") {
          this.showError();
          return;
        }
        this.$router.push({ path: this.getQuizPath()})
      },
      showError() {
        this.errorMessage = "QuizID cannot be empty!"
      }
    }
  }
</script>