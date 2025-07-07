import { Component } from '@angular/core';

@Component({
  selector: 'app-carrousel',
  imports: [],
  templateUrl: './carrousel.html',
  styleUrl: './carrousel.css'
})
export class Carrousel
{
    currentStep = 0;

    steps = [
      {
        title: 'Upload an image',
        description: 'You can upload a binary image, where the stain is shown in white and the background in black.'
      },
      {
        title: 'Generate random points',
        description: 'Select the number of random points (n) to be generated withing the area of the image'
      },
      {
        title: 'Count the points inside the stain',
        description: 'The application will count the points that fall into the white stain (ni)'
      },
      {
        title: 'Estimate the area',
        description: 'The application calculates the area as: estimated_area = image_area × (ni / n).'
      }
    ];

    nextStep() {
      if (this.currentStep < this.steps.length - 1) this.currentStep++;
    }

    prevStep() {
      if (this.currentStep > 0) this.currentStep--;
    }
}
