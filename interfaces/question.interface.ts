export interface IQuestion {
  title: string;
  answers: { correct: boolean; value: string }[];
}
