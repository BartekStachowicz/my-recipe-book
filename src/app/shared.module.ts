import { NgModule } from '@angular/core';
import { DropdownDirective } from './directives/dropdown.directive';
import { AlertComponent } from './shared/alert/alert.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [AlertComponent, DropdownDirective, LoadingSpinnerComponent],
  exports: [AlertComponent, DropdownDirective, LoadingSpinnerComponent],
})
export class SharedModule {}
