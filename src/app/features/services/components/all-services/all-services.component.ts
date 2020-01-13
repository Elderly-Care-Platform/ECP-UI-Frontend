import { Component, OnInit, AfterViewInit, ChangeDetectorRef, HostListener } from '@angular/core';

import { EpcServiceService } from '../../epc-service.service';
import { Service, PageParam, SEO, Breadcrumb } from 'src/app/core/interfaces';
import { JdCategoryService } from 'src/app/core/services';
import { HomeService } from 'src/app/features/home/home.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { SeoService } from 'src/app/core/services/seo.service';
declare var UIkit: any;

@Component({
  selector: 'app-all-services',
  templateUrl: './all-services.component.html',
  styleUrls: ['./all-services.component.scss']
})
export class AllServicesComponent implements OnInit, AfterViewInit {
  breadcrumbLinks: Breadcrumb[] = [
    {
      text: 'Home',
      link: '/'
    },
    {
      text: 'Services',
      link: '/services'
    }
  ];

  services: Service[] = [];
  allService: Service[] = [];
  pageServices: Service[] = [];
  pageSize = 6;
  maxPages: number;
  isLoading: boolean;
  searchTextChanged = new Subject<string>();
  selectedValue: string;
  searchPageParam: PageParam = {
    p: 0,
    s: 6,
    term: ''
  };
  autocompleteFields: Service[] = [];
  // currentUrl: string;
  whatsappUrl;
  showShareBox: boolean;
  verfiedCheck: boolean;
  selectedCategory: string = "allServices";
  mailUrl: string;
  categoryTypes: string[];

  constructor(public ecpService: EpcServiceService,
    public JDcategory: JdCategoryService,
    private homeService: HomeService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activeRoute: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private seoService: SeoService
  ) {
    this.categoryTypes = Object.keys(JDcategory.categories).reverse();

    // Generate meta tag 
    const config: SEO = {
      title: `An Elder Spring Initiative by Tata Trusts All Service`,
      keywords: 'products,services,events,dscussions',
      description: 'An online presence for elders to find reliable products and services. And engage in Events and Discussions',
      author: `An Elder Spring Initiative by Tata Trusts`,
      image: `${window.location.origin}/assets/imgaes/landing-img/Services-320.png`,
    }

    this.seoService.generateTags(config);

  }

  @HostListener('window:click', ['$event.target'])
  clear() {
    this.autocompleteFields = [];
    this.selectedValue = "";
  }

  ngOnInit() {
    this.searchTextChanged.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => {
      this.onSearchChange(this.searchPageParam.term);
    });
    // this.currentUrl = encodeURI(window.location.href);
    this.mailUrl = `mailto:?subject=%0AThis%20is%20Service%20from%20An%20Elder%20Spring%20Initiative%20by%20Tata%20Trusts&body=%0AService%2DURL:%20${encodeURI(window.location.href)}`
    this.whatsappUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`whatsapp://send?text=${encodeURI(window.location.href)}`);
  }

  ngAfterViewInit() {

    this.activeRoute.queryParamMap.subscribe(
      value => {
        // this.currentUrl = encodeURI(window.location.href);
        this.mailUrl = `mailto:?subject=%0AThis%20is%20Service%20from%20An%20Elder%20Spring%20Initiative%20by%20Tata%20Trusts&body=%0AService%2DURL:%20${encodeURI(window.location.href)}`;
        this.whatsappUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`whatsapp://send?text=${encodeURI(window.location.href)}`);
        const queryCategory = value.get("category");
        const catId = value.get("catid");
        if (queryCategory) {
          this.ecpService.searchedService = queryCategory;
          if (catId) {
            this.ecpService.searchCatID = catId;
            this.getCategoryServices(queryCategory, catId);
          } else {
            this.searchPageParam.term = queryCategory;
            this.ecpService.searchCatID = null;
            this.getCategoryServices(queryCategory, 0);
          }
          this.showShareBox = true;
        } else {
          this.showShareBox = false;
          this.getAllService();
        }
      });

  }

  getAllService() {
    this.isLoading = true;
    this.ecpService.searchedService = null;
    this.ecpService.searchCatID = null;

    this.ecpService.getAllServices().subscribe(
      response => {
        if (response) {
          this.services = response;
          this.allService = this.services;
          this.maxPages = Math.round(this.services.length / this.pageSize);
          this.verfiedCheck = false;
          this.isLoading = false;
          // this.router.navigateByUrl('services/all');
        }
      },
      error => {
        this.services = [];
        this.allService = [];
        this.pageServices = [];
        this.isLoading = false;
      })
  }

  getCategoryServices(category, catId) {
    if (catId) {
      this.selectedCategory = category;
    } else {
      this.selectedCategory = 'allServices';
    }
    this.isLoading = true;
    const param: PageParam = {
      p: 0,
      s: 50,
      catid: catId,
      term: category,
    };
    // this.homeService.searchParam.s = 50;
    // this.homeService.searchParam.term = category;
    this.homeService.getCategoryServices(param).subscribe(
      response => {
        if (response && response.data) {
          this.services = response.data;
          this.allService = this.services;
          this.maxPages = Math.round(this.services.length / this.pageSize);
          this.verfiedCheck = false;
          this.isLoading = false;
          // this.searchPageParam.term = category;
        }
      },
      error => {
        this.services = [];
        this.allService = [];
        this.pageServices = [];
        // this.searchPageParam.term = category;
        this.isLoading = false;
      });
  }

  onCategoryChanged(category, catId) {
    this.searchPageParam.term = '';
    this.router.navigate(['services/all'], { queryParams: { category: category, catid: catId } });
  }

  clearSelection() {
    this.selectedCategory = 'allServices';
    // this.searchPageParam.term = '';
    this.router.navigateByUrl('services/all');
  }

  clearSerach() {
    this.searchPageParam.term = '';
    this.router.navigateByUrl('services/all');
  }

  onChangePage(services: any[]) {
    // update current page of items
    this.pageServices = services;
    this.cdr.detectChanges();
    // UIkit.scroll("#serviceList");
    UIkit.scroll('#serviceList').scrollTo('#serviceList');
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
        this.router.navigate(['services/all'], { queryParams: { category: field } });
        // this.getCategoryServices(field, 0);
      }
      this.selectedValue = "";
      this.autocompleteFields = [];
    }
  }

  onSearchClick(service: Service) {
    if (service) {
      // let service: Service;
      // service = this.autocompleteFields.find(service => {
      //   if (service.name && service.name == field) {
      //     return true
      //   } else if (service.basicProfileInfo && service.basicProfileInfo.firstName == field) {
      //     return true;
      //   }
      // });

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

  onCheckVerified(checked) {
    if (checked) {
      this.services = this.allService.filter(service => {
        if (service.verified === '1' || service.verified === checked)
          return service
      });
    } else {
      this.services = this.allService;
    }
  }

  onItemSelected(value) {
    // this.onSearch(value);
    this.selectedValue = value;
    // this.searchPageParam.term = value;
  }
}
