<template>
    <div class="text-2xl p-5 text-blue-800 scale-150">Quiz lobby: {{id}}</div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div class="flex flex-col">
            <div class="text-2xl m-5 text-blue-300">Zadajte meno:</div>
            <input type="text" class="text-2xl rounded text-black text-center" v-model="userName" @keyup.enter="renameSelf(userName)"/>
            <button class="text-2xl border rounded mt-5 px-5" @click="renameSelf(userName)">Enter</button>
            <div class="text-red-500" v-if="errorMessage != ''">{{errorMessage}}</div>
        </div>
        <div class="flex flex-col">
            <div class="text-2xl m-5 text-blue-300">Zoznam účastníkov:</div>
            <div class="text-xl ml-5 self-left" v-for="user in users">{{user.name}}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import store from '@/services/store'
import ws from '@/services/socket'

import type User from '@/objects/User'

export default defineComponent({
    props: ['id'],
    data () {
        return {
            users: [] as User[],
            userName: "" as string,
            errorMessage: "" as string
        }
    },
    created () {
        if (this.id == null) {
            throw new DOMException("Unknown QuizID");
        }
        store.commit('setQuizId', this.id)
    },
    mounted () {
        this.$nextTick(() => {
            ws.send(JSON.stringify({ type: "REGISTER_USER", userId: store.getters['getUserId'], quizId: this.id }));
            ws.onmessage = event => {
                let message = JSON.parse(event.data);
                switch (message['type']) {
                    case "USER_CONNECTED": this.addUser(message['userId']); break;
                    case "USERS_IN_QUIZ": message['users'].forEach((u: User) => this.addUserWithName(u.userId, u.name)); break;
                    case "USER_DISCONNECTED": this.removeUser(message['userId']); break;
                    case "USER_RENAMED": this.renameUser(message['userId'], message['name']); break;
                    case "START_QUIZ": this.$router.push({ path: "/quiz/"+store.getters['getQuizId']})

                }
            };
        });
    },
    methods: {
        addUser(userId: string) {
            console.log(userId)
            this.users.push({userId: userId, name: "", active: true, points: 0, answer: "", answers: []})
        },
        addUserWithName(userId: string, name: string) {
            console.log(userId)
            this.users.push({userId: userId, name: name, active: true, points: 0, answer: "", answers: []})
        },
        renameUser(userId: string, name: string) {
            console.log(userId, name)
            let user = this.users.find((u: { userId: string }) => u.userId == userId);
            if (user != null) {
                user.name = name;
            }
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
        renameSelf(name: string) {
            if (this.userName == "") {
                this.showError();
                return;
            }
            ws.send(JSON.stringify({ type: "RENAME_USER", userId: store.getters['getUserId'], quizId: this.id, name: name }));
        },
        showError() {
            this.errorMessage = "Name cannot be empty!"
        }
    }
})
</script>