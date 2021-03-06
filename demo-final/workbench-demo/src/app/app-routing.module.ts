import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsComponent } from './events/events.component';
import { EventComponent } from './event/event.component';

const routes: Routes = [
  {path: 'events', component: EventsComponent},
  {path: 'events/:eventName', component: EventComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
