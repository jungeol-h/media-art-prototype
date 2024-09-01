export interface AudioFile {
  id: string;
  name: string;
  path: string;
  duration: number; // 마디 수
}

export interface AudioSection {
  id: string;
  title: string;
  items: AudioFile[];
}
