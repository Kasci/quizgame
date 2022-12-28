import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import QuizLobbyView from "@/views/user/QuizLobbyView.vue";
import QuizQuestionView from "@/views/user/QuizQuestionView.vue";
import ManageQuizView from "@/views/admin/ManageQuizView.vue";
import QuizOverview from "@/views/admin/QuizOverview.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/quiz/lobby/:id",
      name: "quizLobby",
      component: QuizLobbyView,
      props: true
    },
    {
      path: "/quiz/manage/:id",
      name: "quizManage",
      component: ManageQuizView,
      props: true
    },
    {
      path: "/quiz/overview/:id",
      name: "quizOverview",
      component: QuizOverview,
      props: true
    },
    {
      path: "/quiz/:id",
      name: "quizQuestion",
      component: QuizQuestionView,
      props: true
    }
  ],
});

export default router;
