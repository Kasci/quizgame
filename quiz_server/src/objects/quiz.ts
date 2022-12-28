import { UserObject } from "./user";

interface QuizObject {
    quizId: string,
    running: boolean,
    admin: UserObject,
    view: UserObject | undefined,
    participants: UserObject[],
    addUser(this: QuizObject, user: UserObject): void;
    removeUser(this: QuizObject, user: UserObject): void;
    renameUser(this: QuizObject, user: UserObject, name: string): void;
    addView(this: QuizObject, user: UserObject): void;
}

function addUser(this: QuizObject, user:UserObject) {
    this.participants.push(user);
    let message = JSON.stringify({
        type: "USER_CONNECTED",
        userId: user.userId,
        quizId: this.quizId
    });
    this.admin.ws.send(message);
    this.participants.forEach(u => u.ws.send(message));
    let userMessage = JSON.stringify({
        type: "USERS_IN_QUIZ",
        users: this.participants.filter(u => u.userId != user.userId).map(user => { return {
            userId: user.userId,
            name: user.name
        }})
    })
    console.log(userMessage)
    user.ws.send(userMessage)
}

function removeUser(this: QuizObject, user: UserObject) {
    let message = JSON.stringify({
        type: "USER_DISCONNECTED",
        userId: user.userId,
        quizId: this.quizId
    });
    this.participants = this.participants.filter((pps: UserObject) => pps != user);
    this.admin.ws.send(message);
    this.participants.forEach(u => u.ws.send(message));
}

function renameUser(this: QuizObject, user: UserObject, name: string) {
    let userr = this.participants.find(u => u.userId == user.userId);
    if (userr != null) {
        userr.name = name;
    }
    let message = JSON.stringify({
        type: "USER_RENAMED", 
        quizId: this.quizId, 
        userId: user.userId, 
        name: name 
    });
    this.admin.ws.send(message);
    this.participants.forEach(u => u.ws.send(message))
}

function addView(this: QuizObject, user:UserObject) {
    this.view = user;
    if (this.running) {
        this.view.ws.send(JSON.stringify({
            type: "START_QUIZ"
        }));
    }
}

export { QuizObject };

export default {
    create: (quizId: string, admin: UserObject): QuizObject => {
        return {
            quizId: quizId,
            admin: admin,
            view: undefined,
            running: false,
            participants: [],
            addUser: addUser,
            removeUser: removeUser,
            renameUser: renameUser,
            addView: addView
        }
    }
};