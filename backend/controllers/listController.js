import List from "../models/List.js";

// ✅ Create a list under a board
export const createList = async (req, res) => {
  if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
     }

   try {
    console.log("Creating list for board:", req.params.boardId);
    console.log("User:", req.user?.id);
    const { title } = req.body;

    const list = new List({
      title,
      board: req.params.boardId,
      createdBy: req.user,
    });

    await list.save();
    res.status(201).json(list);
  } catch (err) {
    console.error("Error creating list:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all lists for a board
export const getLists = async (req, res) => {
  try {
    const lists = await List.find({ board: req.params.boardId });
    res.status(200).json(lists);
  } catch (err) {
    console.error("Error getting lists:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update a list
export const updateList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ message: "List not found" });

    if (list.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedList = await List.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedList);
  } catch (err) {
    console.error("Error updating list:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete a list
export const deleteList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ message: "List not found" });

    if (list.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await list.deleteOne();
    res.json({ message: "List deleted successfully" });
  } catch (err) {
    console.error("Error deleting list:", err);
    res.status(500).json({ message: err.message });
  }
};
