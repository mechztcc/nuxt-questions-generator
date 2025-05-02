export interface IQuestion {
  id?: string;
  title: string;
  level: 'fácil' | 'normal' | 'difícil',
  questionType?: 'opened' | 'closed',
  answers: { correct: boolean; value: string }[];
  marked?: boolean
}
