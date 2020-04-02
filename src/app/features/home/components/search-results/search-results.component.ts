import { Component, OnInit, Input, ViewChild, ElementRef, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  @Input() searchData: any;
  @Input() searchTerm: string;

  servicesTotal: number;
  constructor() {
    console.log(this.searchData, 'search component')
  }

  ngOnInit() {
  }

  getTotalServices(tot: number) {
    this.servicesTotal = tot;
  }
}
