import { bootstrapApplication } from '@angular/platform-browser';
import { RootLayout } from './layouts/root';
import { appConfig } from './app.config';

bootstrapApplication(RootLayout, appConfig).catch((err) => console.error(err));