export interface ISavePayload extends SavePayload {
    zoom: number;
    minZoom: number;
    originalFile: string;
  }
  
  export interface SavePayload extends CropperAttributes {
    croppedFile: string;
  }

  export type CropperAttributes = {
    canvasData: {
      height: number;
      left: number;
      naturalHeight: number;
      naturalWidth: number;
      top: number;
      width: number;
    };
    cropBoxData: {
      height: number;
      left: number;
      top: number;
      width: number;
    };
    data: {
      height: number;
      rotate: number;
      scaleX: number;
      scaleY: number;
      width: number;
      x: number;
      y: number;
    };
  };

  export interface PicCroppedDetails extends CropperAttributes {
    minZoom: number;
    zoom: number;
  }