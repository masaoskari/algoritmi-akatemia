export function checkAnswer(output: string, answer: string): boolean {
  return output.trim() === answer.replace(/\r/g, "").trim();
}
