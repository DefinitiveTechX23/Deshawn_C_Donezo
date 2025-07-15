import express from "express";
const router = express.Router();
import prisma from "../db/index.js";

// GET: Retrieve all todos
router.get("/", async (req, res) => {
  const todos = await prisma.todo.findMany();
  res.status(200).json({
    success: true,
    todos,
  });
});

// POST: Create a new todo
router.post("/", async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    const newTodo = await prisma.todo.create({
      data: {
        name,
        description,
        completed: false,
        userId: req.user.sub,
      },
    });

    res.status(201).json({
      success: true,
      todo: newTodo.id,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later",
    });
  }
});

// PUT: Mark a todo as completed
router.put("/:todoId/completed", async (req, res) => {
  const todoId = Number(req.params.todoId);

  try {
    const todo = await prisma.todo.update({
      where: { id: todoId },
      data: { completed: true },
    });

    res.status(200).json({
      success: true,
      todo: todo.id,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later",
    });
  }
});

router.delete("/:todoId", async (req, res) => {
  const todoId = Number(req.params.todoId);

  try {
    // First, find the todo and confirm it's completed
    const todo = await prisma.todo.findUnique({
      where: { id: todoId },
    });

    if (!todo || !todo.completed) {
      return res.status(400).json({
        success: false,
        message: "Todo must exist and be marked as completed before deletion",
      });
    }

    // If it's completed, delete it
    await prisma.todo.delete({
      where: { id: todoId },
    });

    res.status(200).json({
      success: true,
      todo: todoId,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later",
    });
  }
});

export default router;