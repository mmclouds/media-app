export interface GeneratedVideo {
  uri: string;
  mimeType: string;
}

export enum TabState {
  TEXT_TO_VIDEO = 'Text to Video',
  IMAGE_TO_VIDEO = 'Image to Video',
  MULTI_ELEMENTS = 'Multi-Elements'
}

export enum SubTabState {
  SWAP = 'Swap',
  ADD = 'Add',
  DELETE = 'Delete'
}
