import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SafePipe } from 'src/app/pipe/safe.pipe';

import { AffiliateMarketingComponent } from 'src/app/index/affiliate-marketing/affiliate-marketing.component';
import { PrivacypolicyComponent } from 'src/app/index/privacypolicy/privacypolicy.component';
import { ContactusComponent } from 'src/app/index/contactus/contactus.component'
import { FeedbackComponent } from '../index/feedback/feedback.component';
import { RequestComponent } from 'src/app/index/request/request.component';
import { NewsComponent } from 'src/app/index/news/news.component'
import { BlogComponent } from 'src/app/index/blog/blog.component';
import { WebinarComponent } from 'src/app/index/webinar/webinar.component';
import {CustomMaterialModule } from 'src/app/material.module';
@NgModule({
  declarations: [SafePipe, PrivacypolicyComponent, AffiliateMarketingComponent, FeedbackComponent, ContactusComponent, RequestComponent, NewsComponent, BlogComponent,WebinarComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,CustomMaterialModule
  ],
  exports: [SafePipe]
})
export class SharedModule { }
