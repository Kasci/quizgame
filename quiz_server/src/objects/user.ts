import { WebSocket } from 'ws';

interface UserObject {
    userId: string,
    name: string,
    ws: WebSocket | WebSocket
}

export { UserObject };

export default {
    create: (userId: string, ws: WebSocket | WebSocket): UserObject => {
        return { userId: userId, name: "", ws: ws }
    },
    rename: (name: string): void => {
        name = name;
    } 
}