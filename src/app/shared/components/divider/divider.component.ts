import { Component, input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'mf-core-shared-divider',
  templateUrl: './divider.component.html',
})
export class DividerComponent {
  label = input<string>('');
  margin = input<string>('');
  style = input<string>('margin: 20px 0px;');
  class = input<string>();
}
