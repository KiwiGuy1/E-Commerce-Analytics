import dotenv from "dotenv";
import app from "./app";
import { startSimulator } from "./lib/simulator";

dotenv.config();
dotenv.config({ path: ".env.local", override: true });
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  void startSimulator();
});
