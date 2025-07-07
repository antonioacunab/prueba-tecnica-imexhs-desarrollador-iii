/**
 * Defines an analysis result
 */
export interface ImageAnalysisResult
{
    /**
     * Number of total points
     */
    totalPoints: number;

    /**
     * Number of white points from the total points
     */
    insideStain: number;

    /**
     * Estimated area of white points within the image
     */
    estimatedArea: number;

    /**
     * Image width
     */
    imageWidth: number;

    /**
     * Image height
     */
    imageHeight: number;

    /**
     * Image source
     */
    imageSrc: string;
}