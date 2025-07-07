import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import SweetAlert from "sweetalert2";

import { ImageProcessorService } from '../../services/image-processor.service';
import { ImageAnalysisResult } from '../../models/image-analysis-result';
import { Carrousel } from './carrousel/carrousel';
import { ImageResultStore } from '../../stores/image-result.store';

@Component({
    selector: 'app-upload',
    standalone: true,
    imports: [CommonModule, FormsModule, Carrousel],
    templateUrl: './upload.html',
})
export class Upload
{
    selectedFile: File | null = null;

    imagePreview: string | null = null;

    pointsCount: number = 10000;

    isDragging = false;

    showModal = false;

    constructor (
        private imageProcessorService: ImageProcessorService,
        private router: Router,
        private zone: NgZone,
        private cdr: ChangeDetectorRef,
        private resultStore: ImageResultStore,
    ) { }

    onDragOver(event: DragEvent) {
      event.preventDefault();
      this.isDragging = true;
    }

    onDragLeave(event: DragEvent) {
      event.preventDefault();
      this.isDragging = false;
    }

    onDrop(event: DragEvent)
    {
        event.preventDefault();

        this.isDragging = false;

        if (event.dataTransfer?.files && event.dataTransfer.files.length > 0)
        {
            const file = event.dataTransfer.files[0];

            this.selectedFile = file;

            const reader = new FileReader();

            reader.onload = () => {
              this.zone.run(() => {
                this.imagePreview = reader.result as string;

                this.cdr.detectChanges();
              });
            };

            reader.readAsDataURL(file);
        }
    }

    onFileChange (event: Event)
    {
        const input = event.target as HTMLInputElement;

        if (input.files && input.files[0])
        {
            this.selectedFile = input.files[0]

            const reader: FileReader = new FileReader();

            reader.onload = () => {
              this.zone.run(() => {
                this.imagePreview = reader.result as string;

                this.cdr.detectChanges();
              });
            };

            reader.readAsDataURL(this.selectedFile);
        }
    }

    async onSubmit (event: Event)
    {
        event.preventDefault();

        if ( !this.selectedFile )
            return;

        try
        {
            const imageData: ImageData = await this.imageProcessorService.loadImage(this.selectedFile);

            // Si quieres guardar la imagen para mostrarla en results
            const reader: FileReader = new FileReader();

            reader.onload = () => {
                const result: ImageAnalysisResult = this.imageProcessorService.estimateArea(imageData, this.pointsCount, reader.result as string);

                this.resultStore.add(result);
            };

            reader.readAsDataURL(this.selectedFile);

            this.selectedFile = null;
            this.imagePreview = null;
            this.pointsCount = 10000;
            this.isDragging = false;

            SweetAlert.fire({
              icon: 'success',
              title: 'Image processed!',
              text: 'The stain area was estimated correctly.',
              timer: 3000,
              showConfirmButton: false
            });

            this.cdr.detectChanges();
        }
        catch (error)
        {
          console.error('An error occurred while trying to load the image:', error);
        }
    }
}