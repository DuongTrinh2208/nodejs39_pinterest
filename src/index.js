import express, { request, response } from "express";
import rootRoute from "./routes/rootRoute.js";

const app = express();

app.use(express.json());
app.listen(8080);
app.use(rootRoute);