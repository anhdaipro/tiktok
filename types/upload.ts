export interface UploadResponse {
  secure_url: string;
  public_id:string;
}
export interface UploadFile{
  uri: string;
  name: string;
  type: string;
}

export type LayerTimeline = {
  id: string;
  type: "text" | "sticker";
  content: string; // text hoặc uri sticker
  x: number;
  y: number;
  start: number;
  end: number;
  fade?: boolean;
  scale?: { from: number; to: number };
  rotate?: { from: number; to: number }; // góc xoay
};

export type Clip = { uri: string };