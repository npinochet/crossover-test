import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AppComponent } from './app.component';
import { UploaderComponent } from '@components/uploader/uploader.component';
import { SearcherComponent } from '@components/searcher/searcher.component';
import { ResultsComponent } from '@components/results/results.component';

@NgModule({
  declarations: [
    AppComponent,
    UploaderComponent,
    SearcherComponent,
    ResultsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    InfiniteScrollModule
  ],
  exports: [InfiniteScrollModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
