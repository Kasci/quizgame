<template>
    <div class="grid grid-cols-5 gap-3">
        <div class="col-span-5">Users:</div>
        <div class="contents" :class="userClass(user)" v-for="user in users">
            <div class="col-span-3">{{getName(user)}}</div>
            <div>{{user.answer}}</div>
            <div>{{user.points}}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import type User from '@/objects/User';

export default defineComponent({
    props: ['users'],
    data () {
        return {
            
        }
    },
    mounted() {
        console.log("U", this.users);
    },
    watch: {
        users(oldUsers, newUsers) {console.log(oldUsers, newUsers)}
    },
    methods: {
        userClass(user: User) :string {
            if (!user.active) {
                return "text-gray-600"
            }
            return ""
        },
        getName(user: User) {
            if (user.name == "") {
                return user.userId
            }
            return user.name //+ "(" + user.userId + ")";
        }
    }
});
</script>