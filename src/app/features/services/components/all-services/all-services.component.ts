import { Component, OnInit, AfterViewInit, ChangeDetectorRef, HostListener } from '@angular/core';

import { EpcServiceService } from '../../epc-service.service';
import { Service, PageParam } from 'src/app/core/interfaces';
import { JdCategoryService } from 'src/app/core/services';
import { HomeService } from 'src/app/features/home/home.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-all-services',
  templateUrl: './all-services.component.html',
  styleUrls: ['./all-services.component.scss']
})
export class AllServicesComponent implements OnInit, AfterViewInit {
  services: Service[] = [];
  allService: Service[] = [];
  pageServices: Service[] = [];
  pageSize = 5;
  maxPages: number;
  isLoading: boolean;
  searchTextChanged = new Subject<string>();
  selectedValue: string;
  searchPageParam: PageParam = {
    p: 0,
    s: 5,
    term: ''
  };
  autocompleteFields: Service[] = [];
  currentUrl: string;
  whatsappUrl;

  constructor(public ecpService: EpcServiceService,
    public JDcategory: JdCategoryService,
    private homeService: HomeService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activeRoute: ActivatedRoute,
    public sanitizer: DomSanitizer
  ) { }

  @HostListener('window:click', ['$event.target'])
  clear() {
    this.autocompleteFields = [];
  }

  ngOnInit() {
    this.searchTextChanged.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => {
      this.onSearchChange(this.searchPageParam.term);
    });
    this.currentUrl = window.location.href;
    this.whatsappUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`whatsapp://send?text=${encodeURI(this.currentUrl)}`);
  }

  ngAfterViewInit() {

    const queryCategory = this.activeRoute.snapshot.queryParamMap.get("category");
    if (queryCategory) {
      this.getCategoryServices(queryCategory);
    } else {
      this.getAllService();
    }
  }

  getAllService() {
    this.isLoading = true;
    this.ecpService.getAllServices().subscribe(
      response => {
        if (response) {
          this.services = response;
          this.allService = this.services;
          this.maxPages = Math.round(this.services.length / this.pageSize);
          this.isLoading = false;
          console.log(response);
        }
      },
      error => {
        this.services = [];
        this.allService = [];
        this.pageServices = [];
        this.isLoading = false;
        console.log(error);
      })
  }

  getCategoryServices(category) {

    this.router.navigate(['services/all'], { queryParams: { category: category } });
    this.isLoading = true;
    console.log(category);
    this.homeService.searchParam.s = 50;
    this.homeService.searchParam.term = category;
    this.homeService.getServices().subscribe(
      response => {
        if (response && response.data) {
          this.services = response.data;
          this.allService = this.services;
          this.maxPages = Math.round(this.services.length / this.pageSize);
          this.isLoading = false;
          this.searchPageParam.term = category;
        }
      },
      error => {
        this.services = [];
        this.allService = [];
        this.pageServices = [];
        this.searchPageParam.term = category;
        this.isLoading = false;
        console.log(error);
      });
  }

  onChangePage(services: any[]) {
    // update current page of items
    this.pageServices = services;
    this.cdr.detectChanges();
  }

  onSearchChange(value) {
    if (value !== "") {
      this.homeService.searchParam = this.searchPageParam;
      this.homeService.getAutoCompleteServices().subscribe(
        response => {
          this.autocompleteFields = response;
        });
    } else {
      this.autocompleteFields = [];
    }
  }

  onSearch(field) {
    this.searchPageParam.term = field;
    if (this.searchPageParam.term) {
      if (this.selectedValue) {
        this.searchPageParam.term = this.selectedValue;
      }
      this.getCategoryServices(this.searchPageParam.term);
      // this.searchPageParam.term = "";
      this.selectedValue = "";
      this.autocompleteFields = [];
    }
  }

  searchEvent($event) {
    if ($event.keyCode !== 13) {
      this.searchTextChanged.next($event.target.value);
    }
  }

  onCheckVerified(checked) {
    if (checked) {
      this.services = this.allService.filter(service => service.verified === checked);

    } else {
      this.services = this.allService;
      console.log(this.allService);
    }

  }

  onItemSelected(value) {
    // this.onSearch(value);
    this.selectedValue = value;
    // this.searchPageParam.term = value;
  }
}
