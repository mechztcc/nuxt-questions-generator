export interface IQuestion {
  id?: string;
  title: string;
  level: 'fácil' | 'normal' | 'difícil'
  answers: { correct: boolean; value: string }[];
  marked?: boolean
}
