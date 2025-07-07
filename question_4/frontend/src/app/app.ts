import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, RouterModule, CommonModule],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App {
    protected title = 'frontend-angular';

    activeTab: "upload" | "results" = "upload";

    changeActiveTab (tab: "upload" | "results"): void
    {
        if (tab === this.activeTab)
            return;

        this.activeTab = tab;
    }
}
