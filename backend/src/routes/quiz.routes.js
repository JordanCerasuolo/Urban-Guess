import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  startQuizRunBodySchema,
  submitAnswerBodySchema,
  runIdParamSchema,
  roundParamSchema,
} from "../schemas/quiz.schemas.js";
import {
  startQuizRun,
  getQuizRunDetail,
  getRoundState,
  getRoundImageBuffer,
  submitAnswer,
  giveUpRound,
} from "../services/quiz.service.js";

export const quizRouter = Router();

quizRouter.post("/quiz-runs", requireAuth, async (req, res, next) => {
  try {
    const body = startQuizRunBodySchema.parse(req.body);
    const result = await startQuizRun(req.user.id, body.continent);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
});

quizRouter.get("/quiz-runs/:runId", requireAuth, async (req, res, next) => {
  try {
    const { runId } = runIdParamSchema.parse(req.params);
    const detail = await getQuizRunDetail(runId, req.user.id);
    res.json(detail);
  } catch (e) {
    next(e);
  }
});

quizRouter.get(
  "/quiz-runs/:runId/rounds/:roundOrder",
  requireAuth,
  async (req, res, next) => {
    try {
      const { runId, roundOrder } = roundParamSchema.parse(req.params);
      const state = await getRoundState(runId, roundOrder, req.user.id);
      res.json(state);
    } catch (e) {
      next(e);
    }
  }
);

quizRouter.get(
  "/quiz-runs/:runId/rounds/:roundOrder/image",
  requireAuth,
  async (req, res, next) => {
    try {
      const { runId, roundOrder } = roundParamSchema.parse(req.params);
      const { buffer, mime } = await getRoundImageBuffer(
        runId,
        roundOrder,
        req.user.id
      );
      res.setHeader("Content-Type", mime);
      res.setHeader("Cache-Control", "private, max-age=60");
      res.send(buffer);
    } catch (e) {
      next(e);
    }
  }
);

quizRouter.post(
  "/quiz-runs/:runId/rounds/:roundOrder/submit",
  requireAuth,
  async (req, res, next) => {
    try {
      const { runId, roundOrder } = roundParamSchema.parse(req.params);
      const body = submitAnswerBodySchema.parse(req.body);
      const result = await submitAnswer(
        runId,
        roundOrder,
        req.user.id,
        body.answer
      );
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
);

quizRouter.post(
  "/quiz-runs/:runId/rounds/:roundOrder/give-up",
  requireAuth,
  async (req, res, next) => {
    try {
      const { runId, roundOrder } = roundParamSchema.parse(req.params);
      const result = await giveUpRound(runId, roundOrder, req.user.id);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
);
