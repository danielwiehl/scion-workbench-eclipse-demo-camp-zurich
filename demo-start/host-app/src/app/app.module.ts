import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { WorkbenchModule } from '@scion/workbench';
import { WorkbenchApplicationPlatformModule } from '@scion/workbench-application-platform';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([], {useHash: true}),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
