interface Question {
    question: string,
    answers: [
        {
            letter: string,
            text: string
        },{
            letter: string,
            text: string
        },{
            letter: string,
            text: string
        },{
            letter: string,
            text: string
        },
    ],
    correct: string
}

export default Question