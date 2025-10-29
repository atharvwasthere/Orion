import 'dotenv/config';
import { createServer } from "./server.js";

const port = process.env.PORT || 3000;
const app = createServer();

app.listen(port, () => {
  console.log(`🚀 Orion backend running at http://localhost:${port}`);
});
