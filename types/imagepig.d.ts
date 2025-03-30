declare module "imagepig" {
  export class ImagePig {
    constructor(apiKey: string);
    cutout(image: string, options?: { format?: string }): Promise<string>;
  }
}
