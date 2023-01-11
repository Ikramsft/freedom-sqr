/**
 * @format
 */
export interface IImage {
  croppedImageDetails: string;
  croppedImageReadUrl: string;
  documentId: string;
  imageType: string;
  originalImageReadUrl: string;
}

export type IBusinessImages = {
  background: IImage;
  media: IImage[];
  logo: IImage;
};
