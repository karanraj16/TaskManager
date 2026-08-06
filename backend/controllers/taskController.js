import Task from "../models/Task.js";
import List from "../models/List.js";

// ✅ Create a task
export const createTask = async (req, res) => {
  try {
    const { listId } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    const task = new Task({ title, list: listId ,
          createdBy: req.user._id});
    await task.save();

    list.tasks.push(task._id);
    await list.save();

    res.status(201).json(task);
    console.log("Created Task:", task);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get tasks in a list
export const getTasks = async (req, res) => {
  try {
    const { listId } = req.params;
    const tasks = await Task.find({ list: listId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update a task (title, completed etc.)
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (title !== undefined) task.title = title;
    if (completed !== undefined) task.completed = completed;

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // remove from list.tasks also
    await List.findByIdAndUpdate(task.list, {
      $pull: { tasks: task._id }
    });

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

