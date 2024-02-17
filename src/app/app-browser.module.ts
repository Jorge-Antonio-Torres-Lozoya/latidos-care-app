import { NgModule } from '@angular/core';
import { AppModule } from './app.module';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

//const config: SocketIoConfig = { url: environment.socketUrl, options: {} };
const config: SocketIoConfig = { url: 'http://localhost:5000', options: {} };

@NgModule({
  imports: [
    AppModule,
    SocketIoModule.forRoot(config),
  ],
  bootstrap: [AppComponent],
})
export class AppBrowserModule {}
