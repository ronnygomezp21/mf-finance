import { Component, input, output } from '@angular/core';

@Component({
  selector: 'mf-finance-supplier-tabs',
  standalone: false,
  templateUrl: './supplier-tabs.component.html',
  styleUrls: ['./supplier-tabs.component.scss'],
})
export class SupplierTabsComponent {
  tabLabels = input.required<string[]>();
  activeTab = input<number>(0);
  tabDisabled = input<boolean[]>([]);

  tabChange = output<number>();

  onTabClick(index: number): void {
    if (!this.tabDisabled()[index]) {
      this.tabChange.emit(index);
    }
  }
}
