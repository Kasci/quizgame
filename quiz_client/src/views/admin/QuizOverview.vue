<template>
    <Results v-if="showResults" :results="results"/>
    <div v-else>
        <div v-if="!started">
            Quiz has not started yet.
        </div>
        <Preview v-else v-model:question="question" v-model:viewType="viewType" :alone="true"/>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import type Question from '@/objects/Question'

import Preview from '@/components/Preview.vue'
import Results from '@/components/Results.vue'

import store from '@/services/store'
import ws from '@/services/socket'

export default defineComponent({
    props: ['id'],
    data () {
        return {
            question: {} as Question, 
            viewType: "show" as string,
            index: "" as string,
            started: false as boolean,
            showResults: false as boolean,
            results: {} as any
        }
    },
    components: {
        Preview,
        Results
    },
    created () {
        if (this.id == null) {
            throw new DOMException("Unknown QuizID");
        }
        store.commit('setQuizId', this.id)
    },
    mounted () {
        this.$nextTick(() => {
            ws.send(JSON.stringify({ type: "REGISTER_VIEW", userId: store.getters['getUserId'], quizId: this.id }));
            ws.onmessage = event => {
                let message = JSON.parse(event.data);
                console.log(message)
                switch (message['type']) {
                    case "START_QUIZ":
                        this.started = true;
                        break;
                    case "SHOW_QUESTION":
                        this.question = message['question'];
                        this.viewType = message['viewType'];
                        this.index = message['index'];
                        break;
                    case "SHOW_RESULTS":
                        this.showResults = true;
                        this.results = message['results']
                        break;
                    case "HIDE_RESULTS":
                        this.showResults = false;
                        break;
                }
            };
        });
    },
    methods: {}
})
</script>