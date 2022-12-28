import { Server, WebSocket } from 'ws';

import Quiz, { QuizObject } from './objects/quiz';
import User, { UserObject } from './objects/user';
 
const wss = new Server({ port: 8080 })

let quizes: QuizObject[] = [];
 
wss.on("connection", (ws: WebSocket | WebSocket) => {
    console.log("New client connected");
    ws.on('close', () => {
        console.log('Client has disconnected!')
        userDisconnected();
        console.log(quizes);
    });
    ws.on("message", (data: string) => {
        console.log(`Client has sent us: ${data}`)
        let message = JSON.parse(data);
        resolveMessage(message, ws);
    });
    ws.onerror = function () {
        console.log("Some Error occurred")
    }
});
console.log("The WebSocket server is running on port 8080");

interface MessageObject {
    type: string,
    userId: string,
    quizId: string,
    name: string | undefined,
    question: any | undefined,
    viewType: string | undefined,
    index: number
}

function resolveMessage(message: MessageObject, ws: WebSocket | WebSocket) {
    let userId = message['userId'];
    let quizId = message['quizId'];
    let name = message['name'];
    switch (message['type']) {
        case "CREATE_QUIZ":
            createQuiz(quizId, userId, ws);
            return;
        case "START_QUIZ":
            startQuiz(quizId);
            return;
        case "REGISTER_USER":
            registerUser(quizId, userId, ws);
            return;
        case "RENAME_USER":
            renameUser(quizId, userId, name);
            return;
        case "SHOW_QUESTION":
            showQuestion(quizId, message);
            return;
        case "REGISTER_VIEW": 
            registerView(quizId, userId, ws);
            return;
        case "ANSWER":
            delegateAnswer(quizId, message);
            return;
        case "SHOW_RESULTS":
        case "HIDE_RESULTS":
            delegateResults(quizId, message);
            return;
    }
}

function userDisconnected() {
    quizes.forEach((q: QuizObject) => {
        let person: UserObject | undefined = q.participants.find((u: UserObject) => {
            return u.ws.readyState != WebSocket.OPEN
        })
        if (person != null) {
            q.removeUser(person!)
            return;
        }
    })
}

function createQuiz(quizId: string, userId: string, ws: WebSocket) {
    let user: UserObject = User.create(userId, ws);
    let quiz: QuizObject = Quiz.create(quizId, user); 
    quizes.push(quiz);
}

function startQuiz(quizId: string) {
    let quiz: QuizObject | undefined = quizes.find(q => q.quizId == quizId);
    if (quiz != null) {
        quiz.running = true;
        let message = JSON.stringify({
            type: "START_QUIZ"
        });
        quiz.participants.forEach(
            p => {
                p.ws.send(message);
            }
        )
        if (quiz.view != null) {
            quiz.view.ws.send(message);
        }
    }
}

function registerUser(quizId: string, userId: string, ws: WebSocket) {
    let user: UserObject = User.create(userId, ws);
    let quiz: QuizObject | undefined = quizes.find(q => q.quizId == quizId);
    if (quiz != null) {
        quiz.addUser(user);
    }
}

function renameUser(quizId: string, userId: string, name: string | undefined) {
    if (name != null) {
        let quiz: QuizObject | undefined = quizes.find(q => q.quizId == quizId);
        if (quiz != null) {
            let user: UserObject | undefined = quiz.participants.find(u => u.userId == userId)
            if (user != null) {
                quiz.renameUser(user, name);
                if (quiz.running) {
                    let message = JSON.stringify({
                        type: "START_QUIZ"
                    });
                    user.ws.send(message);
                } 
            }
        }
    }
}

function showQuestion(quizId: string, message: MessageObject) {
    let quiz: QuizObject | undefined = quizes.find(q => q.quizId == quizId);
    if (quiz != null) {
        let outMessage = JSON.stringify(message);
        quiz.participants.forEach(u => {
            console.log("Q to user", outMessage)
            u.ws.send(outMessage)
        })
        if (quiz.view != null) {
            console.log("Q to View", outMessage)
            quiz.view.ws.send(outMessage);
        }
    }
}

function registerView(quizId: string, userId: string, ws: WebSocket) {
    let user: UserObject = User.create(userId, ws);
    let quiz: QuizObject | undefined = quizes.find(q => q.quizId == quizId);
    if (quiz != null) {
        quiz.addView(user);
    }
}

function delegateAnswer(quizId: string, message: MessageObject) {
    let quiz: QuizObject | undefined = quizes.find(q => q.quizId == quizId);
    if (quiz != null) {
        quiz.admin.ws.send(JSON.stringify(message));
    }
}

function delegateResults(quizId: string, message: MessageObject) {
    let quiz: QuizObject | undefined = quizes.find(q => q.quizId == quizId);
    if (quiz != null && quiz.view != null) {
        quiz.view.ws.send(JSON.stringify(message));
    }
}