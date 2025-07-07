import { Injectable } from '@angular/core';
import { ImageAnalysisResult } from '../models/image-analysis-result';

@Injectable({
  providedIn: 'root'
})
export class ImageProcessorService
{
    /**
     * Tries to load an image and store the its data
     *
     * @param file - File to uploaded
     *
     * @returns Data of the image
     */
    async loadImage (file: File): Promise<ImageData>
    {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();

            reader.onload = () => {
                img.src = reader.result as string;
            };

            reader.onerror = () => reject('Error reading file');

            reader.readAsDataURL(file);

            img.onload = () => {
                const canvas = document.createElement('canvas');

                canvas.width  = img.width;
                canvas.height = img.height;

                const context = canvas.getContext('2d');

                if ( !context )
                    return reject('Canvas context not available');

                context.drawImage(img, 0, 0);

                const imageData = context.getImageData(0, 0, img.width, img.height);

                resolve(imageData);
            };

            img.onerror = () => reject('Invalid image');
        });
    }

    /**
     * Generates "n" random points between (0,0) and (height, width)
     *
     * @param n      - Number of points to be generated
     * @param width  - Width of an image
     * @param height - Height of an image
     *
     * @returns A matrix of positions in a 2D space
     */
    generateRandomPoints (n: number, width: number, height: number): [number, number][]
    {
        const points: [number, number][] = [];

        for (let i: number = 0; i < n; i++)
        {
            const x = Math.floor(Math.random() * width);
            const y = Math.floor(Math.random() * height);

            points.push([x, y]);
        }

        return points;
    }

    /**
     * Checks if a pixel is white
     *
     * @param imageData - Image data obtained from the file
     * @param x         - Coordinate in X of the point
     * @param y         - Coordinate in Y of the point
     *
     * @returns "true" if the pixel is white, "false" otherwise
     */
    isWhitePixel (imageData: ImageData, x: number, y: number): boolean
    {
        const { width, data } = imageData;

        // Calculating the index for a specific pixel in "data"
        const index = (y * width + x) * 4;

        const r = data[index]     // -> Red (R)
        const g = data[index + 1] // -> Green (G)
        const b = data[index + 2] // -> Blue (B)
        // const a = data[index + 3] // -> Alpha (A)

        return r === 255 && g === 255 && b === 255;
    }

    /**
     * Estimates the area of the stain for a number of points "n"
     *
     * @remarks The "n" generated points are randomized
     * @remarks This could make the result vary from one execution to another
     *
     * @param imageData - Image data obtained from the file
     * @param n         - The numbers of random points to be generated
     * @param imageSrc  - The filename of the image, for identification purposes only
     *
     * @returns An object of the kind of {@link ImageAnalysisResult}
     */
    estimateArea (imageData: ImageData, n: number, imageSrc: string): ImageAnalysisResult
    {
        const width: number = imageData.width;
        const height: number = imageData.height;

        const totalArea: number = width * height;

        // Generate the random points
        const totalPoints: [number, number][] = this.generateRandomPoints(n, width, height);

        let pointsInside = 0;

        // Everytime that a white point is found, sum +1 to the list of "points inside the stain"
        for (const [x, y] of totalPoints)
            if (this.isWhitePixel(imageData, x, y))
                pointsInside++;

        // Calculate the area of the stain
        const estimatedArea = totalArea * (pointsInside / n);

        const lastResult: ImageAnalysisResult = {
          totalPoints: n,
          insideStain: pointsInside,
          estimatedArea,
          imageWidth: width,
          imageHeight: height,
          imageSrc,
        };

        return lastResult;
    }
}
