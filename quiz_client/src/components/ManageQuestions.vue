<template>
    <div class="grid grid-cols-6 gap-2">
        <button class="border rounded-md border-emerald-400 hover:bg-emerald-900" @click="previousRound()">&lt;</button>
        <span class="col-span-4 text-center truncate">{{getCurrentRound().name}}</span>
        <button class="border rounded-md border-emerald-400 hover:bg-emerald-900" @click="nextRound()">&gt;</button>
        <div class="contents" v-for="(question, index) in getCurrentRound().questions" :index="index">
            <div class="col-span-3">{{question.question}}</div>
            <button class="rounded-md border border-emerald-600 hover:bg-emerald-900" @click="$emit('show',question, index)">Show</button>
            <button class="rounded-md border border-sky-600 hover:bg-sky-900" @click="$emit('preview',question)">Preview</button>
            <button class="rounded-md border border-rose-600 hover:bg-rose-900" @click="$emit('review',question, index)">Review</button>
        </div>
        <button class="col-span-2 border rounded-md border-emerald-600 border-dashed hover:bg-emerald-900" @click="$emit('hide')">Hide</button>
        <button class="col-span-2 border rounded-md border-sky-600 border-dashed hover:bg-sky-900" @click="$emit('hide-preview')">Hide preview</button>
        <button class="col-span-2 border rounded-md border-amber-600 hover:bg-amber-900" @click="$emit('show-results')">Results</button>
        <button :disabled="running" class="col-span-2 border rounded-md border-fuchsia-600 enabled:hover:bg-fuchsia-900 disabled:border-gray-400" @click="startQuiz()">{{running ? 'Quiz started' : 'Start Quiz'}}</button>

    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import store from '@/services/store'

export default defineComponent({
    props: ['quiz'],
    data () {
        return {
            currentRoundIndex: 0,
            running: false
        }
    },
    mounted() {
        this.running = store.getters['getQuizRunning'];
    },
    methods: {
        getCurrentRound() {
            return this.quiz.rounds[this.currentRoundIndex]
        },
        previousRound() {
            this.currentRoundIndex -= 1;
            if (this.currentRoundIndex < 0) {
                this.currentRoundIndex += this.quiz.roundsCount;
            }
        },
        nextRound() {
            this.currentRoundIndex += 1;
            if (this.currentRoundIndex >= this.quiz.roundsCount) {
                this.currentRoundIndex -= this.quiz.roundsCount;
            }
        },
        startQuiz() {
            this.$emit('start-quiz'); 
            store.commit('startQuiz');
            this.running = false
        }
    }
});
</script>