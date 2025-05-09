export interface IQuestion {
  id?: string;
  title: string;
  level: "fácil" | "normal" | "difícil";
  type?: "opened" | "closed";
  context: string;
  answers: { id?: string; correct: boolean; value: string }[];
  marked?: boolean;
}
