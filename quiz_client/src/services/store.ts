import { createStore } from 'vuex'

interface Quiz {
    quizId: string,
    running: boolean
}

const store = createStore({
    state () {
        return {
            userId: crypto.randomUUID(),
            quizId: "",       
            quizes: [] as Quiz[]
        }
    },
    getters: {
        getUserId: (state) => {
            return state.userId;
        },
        getQuizId: (state) => {
            return state.quizId;
        },
        getQuizRunning: (state) => {
            let quiz: Quiz | undefined = state.quizes.find(q => q.quizId == state.quizId);
            if (quiz != null) {
                return quiz.running
            }
            return false;
        }
    },
    mutations: {
        setQuizId: (state, quizId: string) => {
            state.quizId = quizId;
            if (state.quizes.find(q => q.quizId == quizId) != null) {
                state.quizes.push({quizId: quizId, running: false});
            }
        },
        startQuiz: (state, quizId: string) => {
            let quiz = state.quizes.find(q => q.quizId == quizId)
            if (quiz != null) {
                quiz.running = true;
            }
        }
    },
    actions: {
        
    }
})

export default store;
