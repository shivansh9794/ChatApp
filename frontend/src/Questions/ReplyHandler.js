import data from '../Questions/DummyQuestions'

export function findReply(chatbotData, userQuestion) {
  const words = userQuestion.toLowerCase().split(/\s+/); // Split user question into words

  for (const item of chatbotData) {
    for (const question of item.question) {
      const questionWords = question.toLowerCase().split(/\s+/);
      
      if (words.some(word => questionWords.includes(word))) {
        return item.reply;
      }
    }
  }

  return "I'm sorry, I don't have an answer for that.";
}


export function askQuestion(question) {
  const reply = findReply(data.chatbot_data, question);
  console.log("Question:", question);
  console.log("Reply:", reply);
  return reply; // Return the reply
}
