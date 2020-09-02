import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomMaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {SiteHeaderComponent} from './_layout/site-header/site-header.component';
import {SiteSidebarComponent} from './_layout/site-sidebar/site-sidebar.component';
import {SiteLayoutComponent} from './_layout/site-layout/site-layout.component';
import { SiteFooterComponent, } from './_layout/site-footer/site-footer.component';
import { BsDropdownModule } from 'ngx-bootstrap';
import { NgxMatIntlTelInputModule } from './../../node_modules/ngx-mat-intl-tel-input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogComponent } from './dialog/dialog.component';
import { MatVideoModule } from 'mat-video';




@NgModule({
  declarations: [
    AppComponent,
    SiteHeaderComponent,
    SiteSidebarComponent,
    SiteLayoutComponent,
    SiteFooterComponent,
    DialogComponent,    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatVideoModule,
    HttpClientModule,
    CustomMaterialModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatIntlTelInputModule,
    BsDropdownModule.forRoot(),
  ],
  providers: [
              
            ],
  bootstrap: [AppComponent], entryComponents: [DialogComponent]
})
export class AppModule { }