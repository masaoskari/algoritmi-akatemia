export function checkAnswer(output: string, answer: string): boolean {
  return output.trim() ===  answer.replace(/\\n/g, '\n').trim();
}
