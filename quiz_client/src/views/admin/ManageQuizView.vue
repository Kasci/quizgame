<template>
    <div class="flex flex-col w-full">
        <div class="grid grid-cols-2 gap-10 w-full">
            <div class="text-center text-xl my-5 col-span-2">
                Manage Quiz {{id}}
                <hr/>
            </div>
            <Results v-if="showResults" :results="getResults()"/>
            <Preview v-else :question="question" :viewType="viewType" :alone="false"/>
            <Preview :question="preQuestion" viewType="preview" :alone="false"/>
            <ManageQuestions class="col-span-2" :quiz="quiz" 
                @show="(q, i) => showQuestion(q, 'show', i)" 
                @preview="q => preQuestion = q" 
                @review="(q, i) => showQuestion(q, 'review', i)"
                @hide="hideQuestion()"
                @hide-preview="preQuestion = {} as Question" 
                @start-quiz="startQuiz()"
                @show-results="switchResults()"/>
            <ManageUsers :users="users"/>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Preview from '@/components/Preview.vue'
import Results from '@/components/Results.vue'
import ManageQuestions from '@/components/ManageQuestions.vue'
import ManageUsers from '@/components/ManageUsers.vue'

import store from '@/services/store'
import ws from '@/services/socket'

import tmpQuiz from '@/assets/tmpQuiz2'
import tmpUsers from '@/assets/tmpUsers'

import type User from '@/objects/User'
import type Question from '@/objects/Question'

export default defineComponent({
    props: ['id'],
    data () {
        return {
            users: [] as User[],
            question: {} as Question,
            preQuestion: {} as Question,
            viewType: 'show',
            quiz: tmpQuiz,
            showResults: false
        }
    },
    components: {
        Preview,
        Results,
        ManageQuestions,
        ManageUsers
    },
    created () {
        if (this.id == null) {
            throw new DOMException("Unknown QuizID");
        }
        store.commit('setQuizId', this.id)
    },
    mounted () {
        this.$nextTick(() => {
            ws.send(JSON.stringify({ type: "CREATE_QUIZ", userId: store.getters['getUserId'], quizId: this.id }));
            ws.onmessage = event => {
                let message = JSON.parse(event.data);
                console.log("A", message)
                switch (message['type']) {
                    case "USER_CONNECTED": this.addUser(message['userId']); break;
                    case "USERS_IN_QUIZ": message['users'].forEach((u: User) => {
                        this.addUser(u.userId);
                        this.renameUser(u.userId, u.name);
                    }); break;
                    case "USER_DISCONNECTED": this.removeUser(message['userId']); break;
                    case "USER_RENAMED": this.renameUser(message['userId'], message['name']); break;
                    case "ANSWER": this.collectAnswer(message); break;
                }
            };
        });
    },
    methods: {
        addUser(userId: string) {
            if (this.users.find(u => u.userId == userId) == null) {
                this.users.push({userId: userId, name: "", active: true, points: 0, answer: "", answers: []})
            }
            console.log(this.users);
        },
        renameUser(userId: string, name: string) {
            let user = this.users.find((u: { userId: string }) => u.userId == userId);
            if (user != null) {
                user.name = name;
            }
            console.log(this.users);
        },
        removeUser(userId: string) {
            let user = this.users.find((u: { userId: string }) => u.userId == userId);
            if (user != null) {
                user.active = false;
            }
        },
        reactivateUser(userId: string) {
            let user = this.users.find((u: { userId: string }) => u.userId == userId);
            if (user != null) {
                user.active = true;
            }
        },
        showQuestion(q: Question, viewType: string, index: number) {
            this.evaluate();
            this.question = q; 
            this.preQuestion = q
            this.viewType = viewType;
            ws.send(JSON.stringify({
                type: "SHOW_QUESTION",
                quizId: this.id,
                question: q,
                index: index,
                viewType: viewType
            }));
        },
        hideQuestion() {
            this.evaluate();
            this.question = {} as Question; 
            ws.send(JSON.stringify({
                type: "SHOW_QUESTION",
                quizId: this.id,
                question: {},
                viewType: "show"
            }))
        },
        startQuiz() {
            ws.send(JSON.stringify({
                type: "START_QUIZ",
                quizId: this.id
            }));
        },
        collectAnswer(message: any) {
            console.log(message);
            let user = this.users.find((u: { userId: string }) => u.userId == message['userId']);
            if (user != null) {
                user.answer = message['answer']
                let answer = user.answers.find(a => a.index == message['index']);
                if (answer == null) {
                    user.answers.push({ index: message['index'], answer: user.answer });
                } else {
                    answer.answer = user.answer;
                }
            }
        },
        evaluate() {
            this.users.forEach(u => {
                u.points += u.answer == this.question.correct ? 1 : 0;
                u.answer = "";
            })
        },
        switchResults() {
            if (this.showResults) {
                ws.send(JSON.stringify({
                    type: "HIDE_RESULTS",
                    quizId: this.id,
                    results: []
                }))
                this.showResults = false
            } else {
                ws.send(JSON.stringify({
                    type: "SHOW_RESULTS",
                    quizId: this.id,
                    results: this.getResults()
                }))
                this.showResults = true;
            }
        },
        getResults() {
            return this.users.map(u => { return {
                name: u.name,
                points: u.points
            }})
        }
    }
})
</script>