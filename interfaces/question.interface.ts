export interface IQuestion {
  title: string;
  level: 'fácil' | 'normal' | 'difícil'
  answers: { correct: boolean; value: string }[];
}
