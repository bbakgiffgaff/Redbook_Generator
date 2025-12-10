export enum CardType {
  COVER = 'COVER',
  CONTENT = 'CONTENT'
}

export interface CardConfig {
  id: string;
  type: CardType;
  title?: string;
  content?: string;
  pageNumber?: number;
  totalPages?: number;
}

export interface AppState {
  title: string;
  text: string;
}