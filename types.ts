
export enum CardType {
  Text = 'TEXT',
  Video = 'VIDEO',
  Image = 'IMAGE',
  PdfPage = 'PDF_PAGE',
  Exam = 'EXAM',
}

export enum ExamType {
  MultipleChoice = 'MULTIPLE_CHOICE',
  TrueFalse = 'TRUE_FALSE',
  ShortAnswer = 'SHORT_ANSWER',
}

export interface BaseCard {
  id: string;
  type: CardType;
  bookmarked: boolean;
  note?: string;
}

export interface TextCard extends BaseCard {
  type: CardType.Text;
  content: string;
}

export interface VideoCard extends BaseCard {
  type: CardType.Video;
  url: string;
}

export interface ImageCard extends BaseCard {
  type: CardType.Image;
  url: string;
  alt: string;
}

export interface PdfPageCard extends BaseCard {
  type: CardType.PdfPage;
  url: string;
  pageNumber: number;
}

export interface ExamCard extends BaseCard {
  type: CardType.Exam;
  examType: ExamType;
  question: string;
  options?: string[];
  correctAnswer: string | boolean;
  userAnswer?: string | boolean;
}

export type Card = TextCard | VideoCard | ImageCard | PdfPageCard | ExamCard;

export interface Module {
  id: string;
  title: string;
  cards: Card[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

export interface Note {
  cardId: string;
  note: string;
  courseTitle: string;
  moduleTitle: string;
}

export interface Progress {
    courseTitle: string;
    totalModules: number;
    completionPercentage: number;
}
