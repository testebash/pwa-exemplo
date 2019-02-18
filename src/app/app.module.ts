import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ServiceWorkerModule, SwUpdate, SwPush } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { stringify } from '@angular/core/src/util';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    environment.production ? ServiceWorkerModule.register('ngsw-worker.js') : []
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(swUpdate: SwUpdate, swPush: SwPush) {
    swUpdate.available.subscribe(update => {
      console.log('Update disponível');
    });
    swPush.messages.subscribe(push => {
      console.log('Push disponível');
      const str = String(push);
      const obj = JSON.parse(str.replace(/\//g, '"'));
      const a = new Notification(obj['Title'], {body: obj['Body'], icon: './assets/iconf_512.png'});
      navigator.serviceWorker.getRegistration().then(
        reg => reg.showNotification(obj['Title'], {body: obj['Body'] + ' persistente', icon: './assets/iconf_512.png'})
      );
    });
    const chave = 'BBAtmX80o8gerKucttcnCQT9N5MXN6VByVcziIy1MlRDk6VtbEBf4W3hTrCM71I_tSV7hjfNwOrBOEdZ6fka9pM';
    swPush.requestSubscription({serverPublicKey: chave}).then(pushResultado => {
      console.log(pushResultado.toJSON());
      localStorage.setItem('caminho', String(pushResultado.toJSON()));
    });
  }
}
