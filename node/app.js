require('dotenv').config();
require('module-alias/register');

const App = require('./src/app/server');

async function bootstrap() {
  const app = new App();
  await app.init();
  app.listen();
}

bootstrap().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
