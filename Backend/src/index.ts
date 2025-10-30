import 'dotenv/config';
import { createServer } from "./server.js";

const port = Number(process.env.PORT) || 3000;
const app = createServer();

app.listen(port,'0.0.0.0', () => {
  console.log(`🚀 Orion backend running at http://localhost:${port}`);
});
