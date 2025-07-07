import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ImageAnalysisResult } from '../../models/image-analysis-result';
import { ImageProcessorService } from '../../services/image-processor.service';
import { ImageResultStore } from '../../stores/image-result.store';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.html',
  styleUrl: './results.css'
})
export class Results implements OnInit
{
    results: ImageAnalysisResult[] = [];

    constructor (private resultStore: ImageResultStore) { }

    ngOnInit ()
    {
        this.resultStore.results$.subscribe((results: ImageAnalysisResult[]) => {
            this.results = results;
        });
    }
}
