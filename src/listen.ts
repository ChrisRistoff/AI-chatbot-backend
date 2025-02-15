import { app } from "./app";
const { PORT = 9000 } = process.env;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
