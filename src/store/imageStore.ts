import { defineStore } from 'pinia'

interface ImageState {
  tempImage: Blob | null,
  originalImageUrl: string,
  transformedImageUrl: string
}

export const useImageStore = defineStore('image', {
  state: (): ImageState => ({
    tempImage: null,
    originalImageUrl: '',
    transformedImageUrl:''
  }),
  actions: {
    setTempImage(image: Blob) {
      this.tempImage = image
    },
    setOriginalImageUrl(url:string){
      this.originalImageUrl = url
    },
    setTransformedImageUrl(url:string){
      this.transformedImageUrl = url
    },
    clearTempImage() {
      this.tempImage = null
    }
  }
})