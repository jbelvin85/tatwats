// Load environment variables from .env.test before any application code runs
require('dotenv').config({ path: './.env.test', override: true });
