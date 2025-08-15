// src/main.ts
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(() => {
    // Initialiser les champs Materialize après que l'application a démarré
    // Cela permet aux labels de bien flotter
    const M = (window as any).M;
    if (M && M.updateTextFields) {
      M.updateTextFields();
    }
  })
  .catch(err => console.error(err));
