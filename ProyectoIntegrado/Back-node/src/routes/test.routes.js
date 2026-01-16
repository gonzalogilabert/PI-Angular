import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  console.log(" POST recibido en test:", req.body);
  res.json({ msg: "OK", recibido: req.body });
});

export default router;
