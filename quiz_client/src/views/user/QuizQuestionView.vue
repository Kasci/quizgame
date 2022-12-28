<template>
    <Preview v-model:question="question" v-model:viewType="viewType" :alone="true"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import ws from '@/services/socket'

import type Question from '@/objects/Question'

import Preview from '@/components/Preview.vue'

export default defineComponent({
    props: ['id'],
    data () {
        return {
            question: {} as Question, 
            viewType: "show" as string,
            index: "" as string
        }
    },
    components: {
        Preview,
    },
    mounted() {
        this.$nextTick(() => {
            ws.onmessage = event => {
                let message = JSON.parse(event.data);
                console.log(message)
                switch (message['type']) {
                    case "SHOW_QUESTION":
                        this.question = message['question'];
                        this.viewType = message['viewType'];
                        this.index = message['index'];
                }
            }
        });
    },
    methods: {}
})
</script>