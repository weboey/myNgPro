import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-search',
  template: `
    <nz-select [nz-tooltip]="'tooltip'"
                style="width: 120px;"
                nzAllowClear
                nzShowSearch
                [(ngModel)]="listOfTagOptions">
      <nz-option *ngFor="let option of listOfOption" [nzLabel]="option.label" [nzValue]="option.value">
      </nz-option>
    </nz-select>
  `
})
export class SelectSearchComponent implements OnInit {
  listOfOption = [];
  listOfTagOptions = [];

  ngOnInit(): void {
    const children = [];
    for (let i = 10; i < 36; i++) {
      children.push({ label: i.toString(36) + i, value: i.toString(36) + i });
    }
    this.listOfOption = children;
  }
}
