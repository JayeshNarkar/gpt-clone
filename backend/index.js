const express = require("express");
const app = express();
const cors = require("cors");
const OpenAI = require("openai");
const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });
const router = express.Router();
app.use(express.json());

app.use(cors());

const port = process.env.PORT || 3000;

router.get("/", async (req, res) => {
  res.status(200).json({ res: "hello world!" });
});

const gptFunction = async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: req.body.context },
        { role: "user", content: req.body.prompt },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.8,
      max_tokens: 64,
      top_p: 1,
    });
    res.status(200).json({ res: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error in /gpt endpoint:", error.message);
    res.status(error.status || 500).json({ error: error.message });
  }
};

router.post("/gpt", gptFunction);

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
