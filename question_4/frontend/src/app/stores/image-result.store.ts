import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ImageAnalysisResult } from '../models/image-analysis-result';

@Injectable({ providedIn: 'root' })
export class ImageResultStore
{
    private _results = new BehaviorSubject<ImageAnalysisResult[]>([]);

    public readonly results$ = this._results.asObservable();

    add (result: ImageAnalysisResult): void
    {
        const current = this._results.value;
        this._results.next([...current, result]);
    }

    clear (): void
    {
        this._results.next([]);
    }
}