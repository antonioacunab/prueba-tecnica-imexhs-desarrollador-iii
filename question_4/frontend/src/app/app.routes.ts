import { Routes } from '@angular/router';
import { Upload } from './components/upload/upload';
import { Results } from './components/results/results';

export const routes: Routes = [
    {
        "path": "upload",
        component: Upload,
    },
    {
        "path": "results",
        component: Results,
    }
];
