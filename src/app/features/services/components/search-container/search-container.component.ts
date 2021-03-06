import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { HomeService } from 'src/app/features/home/home.service';
import { PageParam } from 'src/app/core';
import { Service } from 'src/app/core/interfaces';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { EpcServiceService } from '../../epc-service.service';

@Component({
  selector: 'app-search-container',
  templateUrl: './search-container.component.html',
  styleUrls: ['./search-container.component.scss']
})
export class SearchContainerComponent implements OnInit, AfterViewInit {

  showReset: boolean;
  selectedValue: string;
  popullarService: Service[];
  totalService: number;
  searchTextChanged = new Subject<string>();
  searchPageParam: PageParam = {
    p: 0,
    s: 6,
    term: ''
  };


  autocompleteFields: Service[] = [];

  constructor(private homeService: HomeService, private router: Router, public ecpService: EpcServiceService) {
    //this.ecpService.showBg = false 
  }

  ngOnInit() {
    this.searchTextChanged.pipe(
      debounceTime(10),
      distinctUntilChanged()
    ).subscribe(() => {
      this.onSearchChange(this.searchPageParam.term);
    });

    if (this.homeService.homeSearchtxt) {
      this.searchPageParam.term = this.homeService.homeSearchtxt;
      this.showReset = true;
      //this.ecpService.showBg = true;
      // this.searchService();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      document.getElementById("serviceSearch").focus();
    }, 1);
  }

  @HostListener('window:click', ['$event.target'])
  clear() {
    this.autocompleteFields = [];
    this.selectedValue = "";
  }

  /**
   * Get Autocomplete data
   * @param value 
   */
  onSearchChange(value) {
    if (value !== "") {
      this.showReset = true;
      this.homeService.searchParam = this.searchPageParam;
      // this.homeService.getAutoCompleteServices().subscribe(
      //   response => {
      //     this.autocompleteFields = response;
      //   });
    } else {
      this.autocompleteFields = [];
      this.homeService.homeSearchtxt = "";
      this.showReset = false;
      this.ecpService.showBg = false;
      this.router.navigate(['/services'], { queryParams: { searchTxt: this.searchPageParam.term, category: this.ecpService.searchedService, catid: this.ecpService.searchCatID } })
    }
  }

  searchService() {
    // const param = this.searchPageParam.term;
    this.ecpService.searchedService = "";
    this.ecpService.searchCatID = "";
    this.homeService.serviceCategory = "";
    this.homeService.serviceSubCategory = "";
    this.homeService.homeSearchtxt = this.searchPageParam.term;
    this.ecpService.showBg = true;
    this.router.navigate(['/services'], { queryParams: { searchTxt: this.searchPageParam.term } })

  }


  onSearch(field?: string) {
    if (field || this.selectedValue) {
      let service: Service;
      if (this.selectedValue) {
        // this.searchPageParam.term = this.selectedValue;
        service = this.autocompleteFields.find(service => {
          if (service.name && service.name == this.selectedValue) {
            return true
          } else if (service.basicProfileInfo && service.basicProfileInfo.firstName == this.selectedValue) {
            return true;
          }
        });

        if (service.hasOwnProperty('basicProfileInfo')) {
          this.router.navigate([`/services/${service.basicProfileInfo.firstName}/${service.id}/${true}`]);
        } else {
          this.router.navigate([`/services/${service.name}/${service.docid}/${false}`]);
        }

      } else {
        this.searchService();
      }
      this.selectedValue = "";
      this.autocompleteFields = [];
      document.getElementById("serviceSearch").focus();
    }
  }

  resetSearch() {
    this.searchPageParam.term = "";
    this.autocompleteFields = [];
    this.showReset = false;
    this.ecpService.showBg = false;
    this.popullarService = undefined;
    this.homeService.homeSearchtxt = "";
    document.getElementById("serviceSearch").focus();
    this.homeService.serviceCategory = "";
    this.homeService.serviceSubCategory = "";
    this.router.navigate(['services'], { queryParams: { searchTxt: this.searchPageParam.term } });
  }


  onAutocompleteClick(service: Service) {
    // this.searchPageParam.term = field;
    // this.selectedValue = "";
    // this.autocompleteFields = [];
    if (service) {
      if (service.hasOwnProperty('basicProfileInfo')) {
        this.router.navigate([`/services/${service.basicProfileInfo.firstName}/${service.id}/${true}`]);
      } else {
        this.router.navigate([`/services/${service.name}/${service.docid}/${false}`]);
      }
    }
  }

  searchEvent($event) {
    if ($event.keyCode !== 13) {
      this.searchTextChanged.next($event.target.value);
    }
  }

  onItemSelected(value) {
    this.selectedValue = value;
    // this.searchPageParam.term = value;
  }

}
