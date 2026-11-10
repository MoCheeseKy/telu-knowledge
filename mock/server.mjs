import jsonServer from 'json-server';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const seedFile = path.resolve(__dirname, 'mock_data.seed.json');
const router = jsonServer.router(seedFile);
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 4000;

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom response wrapper agar format respons sama persis dengan ApiEnvelope NestJS
router.render = (req, res) => {
  if (
    res.locals.data &&
    typeof res.locals.data === 'object' &&
    'statusCode' in res.locals.data &&
    'isError' in res.locals.data
  ) {
    res.json(res.locals.data);
  } else {
    res.json({
      statusCode: res.statusCode || 200,
      message: [],
      data: res.locals.data,
      isError: false,
    });
  }
};

// Mount router pada /api dan /
server.use('/api', router);
server.use(router);

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Tel-U Knowledge Mock Server (json-server 0.17.4)`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📁 Seed: ${seedFile}`);
  console.log(`======================================================\n`);
});

