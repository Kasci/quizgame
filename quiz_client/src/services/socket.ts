import { registerRuntimeCompiler } from "vue";

const ws = new WebSocket("ws://localhost:8080");

ws.onopen = (event) => {
    console.log("Connected")
}

export default ws;