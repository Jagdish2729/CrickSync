import "dotenv/config";
import cors from "cors";
import express from "express";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "cricksync-api" });
});

app.listen(port, () => {
  console.log(`CrickSync API running on http://localhost:${port}`);
});
