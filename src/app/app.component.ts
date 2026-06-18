import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'mf-finance-root',
  standalone: true,
  imports: [RouterOutlet, SharedModule, NgSelectModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'mf-finance';
}
