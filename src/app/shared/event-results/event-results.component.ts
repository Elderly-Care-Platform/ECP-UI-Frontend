import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../app/features/community/services/events.service'
import { SEO } from 'src/app/core/interfaces';
import { DomSanitizer } from '@angular/platform-browser';
import { SeoService } from 'src/app/core/services/seo.service';
import { HomeService } from 'src/app/features/home/home.service';

@Component({
  selector: 'app-event-results',
  templateUrl: './event-results.component.html',
  styleUrls: ['./event-results.component.scss']
})
export class EventResultsComponent implements OnInit {
  @Input() searchTxt: string;
  @Input() showPagination: boolean;
  @Input() showSharing: boolean;
  @Output() showCount: EventEmitter<number> = new EventEmitter();
  @Input() hide: true;
  
  eventsList: any[];
  countData: { "all": 0, "outdoor": 0, "indoor": 0 };
  searchParams: {
    p: number,
    s: number,
    searchTxt: string,
    eventType: number,
    pastEvents: number,
    dir:number
  };
  paramsSubs: any;
  totalRecords: number;
  currentUrl: string;
  whatsappUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    public sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.currentUrl = encodeURI(window.location.href);
    this.whatsappUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://web.whatsapp.com/send?text=${encodeURI(this.currentUrl)}`);
    this.countData = { "all": 0, "outdoor": 0, "indoor": 0 };
    this.paramsSubs = this.route.queryParams.subscribe(params => {
      this.initiate();
    });
    //this.router.navigate([], { queryParams: { past: -1, searchTxt: this.searchParams.searchTxt } });
  }
  ngOnDestroy() {
    this.paramsSubs.unsubscribe();
  }

  initiate() {
    this.searchParams = {
      p: 0,
      s: 4,
      searchTxt: "",
      eventType: 0,
      pastEvents: 0,
      dir:0
    }

    this.totalRecords = 0;
    if(this.searchTxt){
      this.searchParams.searchTxt = this.searchTxt;
    }
    if (this.route.snapshot.queryParams['past'] !== undefined) {
      this.searchParams.pastEvents = this.route.snapshot.queryParams['past'];
    }
    if (this.route.snapshot.queryParams['searchTxt'] !== undefined) {
      this.searchParams.searchTxt = this.route.snapshot.queryParams['searchTxt'];
    }
    if (this.route.snapshot.queryParams['page'] !== undefined) {
      this.searchParams.p = this.route.snapshot.queryParams['page'];
    }
    this.showEvents();
    this.showEventsCount();
  }

  changePage(page: number) {
    this.searchParams.p = page;
    if(this.showPagination){
      this.router.navigate(['/community'], { queryParams: { past: this.searchParams.pastEvents, searchTxt: this.searchParams.searchTxt, page: this.searchParams.p } });
    }
    else{
        this.showEvents();
    }
  }

  showEvents() {
    if(this.searchParams.pastEvents==-1){
      this.searchParams.dir = 1;
    }
    else if(this.searchParams.pastEvents==1){
      this.searchParams.dir = 0;
    }
    else if(this.searchParams.pastEvents==0){
      this.searchParams.dir = 0;
    }
    this.eventService.searchEvents(this.searchParams).subscribe((response: any) => {
      const data = response.data;
      this.eventsList = [];
      if (data.content) {
        this.eventsList = data.content;
        this.totalRecords = data.total;
        this.showCount.emit(this.totalRecords);
      }
    });
  }

  showEventsCount() {
    this.eventService.searchEventsCount({ "searchTxt": this.searchParams.searchTxt, "eventType": 0 }).subscribe((response: any) => {
      this.countData = response.data;
    });
  }

  showTodayText(timestamp: number) {
    const today = new Date();
    let checkDay = new Date(timestamp);
    if (checkDay.getDate() == today.getDate() &&
      checkDay.getMonth() == today.getMonth() &&
      checkDay.getFullYear() == today.getFullYear()) {
      return "(Today)";
    }
    checkDay = new Date(timestamp - 86400000);
    if (checkDay.getDate() == today.getDate() &&
      checkDay.getMonth() == today.getMonth() &&
      checkDay.getFullYear() == today.getFullYear()) {
      return "(Tomorrow)";
    }
  }

  onTabChange(value) {
    this.searchParams.pastEvents = value;
    if(this.showPagination){
      this.router.navigate(['/community'], { queryParams: { past: this.searchParams.pastEvents, searchTxt: this.searchParams.searchTxt, show: "events" } });
    }
    else{
        this.showEvents();
    }
  }

  clearSelection() {
    this.searchParams.pastEvents = -1;
    this.searchParams.p = 0;
    if(this.showPagination){
      this.router.navigate(['/community'], { queryParams: { past: this.searchParams.pastEvents, searchTxt: this.searchParams.searchTxt, show: "events" } });
    }
    else{
        this.showEvents();
    }
  }
}