<template>
    <div class="flex flex-col justify-middle">
        <div v-if="question.question != null" :class="alone ? 'w-screen' : ''" class="grid grid-cols-1 sm:grid-cols-2 grid-flow-row">
            <div :class="colors(['border','bg'])" class="col-span-1 sm:col-span-2 text-center rounded-lg m-2" >{{question.question}}</div>
            <button class="border rounded-md m-2" :class="[colors(['border']), correct(ans), user('hover:bg')]" v-for="ans in question.answers" @click="sendAnswer(question.index, ans)">
                <span>{{ans.letter}}</span>)&nbsp;<span>{{ans.text}}</span>
            </button>
        </div>
        <div v-else class="align-middle text-center font-bold">
            No question yet
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import ws from '@/services/socket'
import store from '@/services/store'

export default defineComponent({
    props: ['question', 'viewType', 'alone'],
    methods: {
        colors(t: string[]) {
            return {
                "bg-emerald-900": t.some(x => x == "bg") && this.viewType == "show",
                "hover:bg-emerald-900": t.some(x => x == "hover:bg") && this.viewType == "show",
                "border-emerald-900": t.some(x => x == "border") && this.viewType == "show",
                "bg-sky-900": t.some(x => x == "bg") && this.viewType == "preview",
                "border-sky-900": t.some(x => x == "border") && this.viewType == "preview",
                "bg-rose-900": t.some(x => x == "bg") && this.viewType == "review",
                "border-rose-900": t.some(x => x == "border") && this.viewType == "review",
            }
        },
        correct(ans: { letter: any }) {
            if ((this.viewType == "review" || this.viewType == "preview") && this.question.correct == ans.letter) {
                return this.colors(['bg'])
            }
            return "";
        },
        user(t: string) {
            if (this.viewType == "show" && this.alone) {
                return this.colors([t]);
            }
            return "";
        },
        sendAnswer(index: string, ans: { letter: string }) {
            ws.send(JSON.stringify({
                type: "ANSWER",
                quizId: store.getters['getQuizId'],
                userId: store.getters['getUserId'],
                index: index,
                answer: ans.letter
            }))
        }
    }
})
</script>