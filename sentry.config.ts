import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: 'https://b5b21aa96e19f6e3c0d2db4b770817b7@o4509486539669504.ingest.us.sentry.io/4509486565556224', // Replace this with your actual Sentry DSN
  enableInExpoDevelopment: true,
  debug: __DEV__,
  tracesSampleRate: 1.0,
}); 