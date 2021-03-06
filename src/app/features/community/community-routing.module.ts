import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from 'src/app/ui';
import { CommunityPageComponent } from './components/community-page/community-page.component';
import { EventsListPageComponent } from './components/events-list/events-list-page.component';
import { EventDetailPageComponent } from './components/event-detail/event-detail-page.component';
import { EventCreatePageComponent } from './components/event-create/event-create-page.component';
import { DiscussionDetailPageComponent } from './components/discussion-detail/discussion-detail-page.component';
import { DiscussionsListPageComponent } from './components/discussions-list/discussions-list-page.component'
import { DiscussionCreatePageComponent } from './components/discussion-create/discussion-create-page.component'

const routes: Routes = [
  {
    path: '',
    component: CommunityPageComponent
  },
  {
    path: 'events',
    redirectTo: '/community?past=-1' //this redirection is added to redirect no result found from home page to correct tab in community page
    // component: EventsListPageComponent
  },
  {
    path: 'event/add',
    component: EventCreatePageComponent
  },
  {
    path: 'event/:id',
    component: EventDetailPageComponent
  },
  {
    path: 'discussions',
    component: DiscussionsListPageComponent
  },
  {
    path: 'discussions/:category',
    component: DiscussionsListPageComponent
  },
  {
    path: 'discussion/add',
    component: DiscussionCreatePageComponent
  },
  {
    path: 'discussion/edit/:id',
    component: DiscussionCreatePageComponent
  },
  {
    path: 'discussion/:id',
    component: DiscussionDetailPageComponent
  },
  {
    path: 'discussion/:id/:category',
    component: DiscussionDetailPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunityRoutingModule { }
