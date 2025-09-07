import React, { useState } from "react";
import { createTodo, updateTodo } from "@/lib/supabaseTD";

const TodoModal = ({
  id,
  title,
  setTitle,
  priority,
  setPriority,
  tags,
  setTags,
  onSuccess,
}) => {
  const createHandler = async (title, priority, tags) => {
    try {
      const metadata = { priority, tags };
      await createTodo(title, metadata);
      onSuccess();
      document.getElementById("createModal").close();
      setTitle("");
      setPriority("low");
      setTags([]);
    } catch (error) {
      console.error("Create todo error:", error);
    }
  };

  const editHandler = async (id, title, priority, tags) => {
    try {
      const metadata = { priority, tags };
      await updateTodo(id, title, metadata);
      onSuccess();
      document.getElementById("editTodo").close();
    } catch (error) {
      console.error("Edit todo error:", error);
    }
  };

  return (
    <div className="modal-box">
      <form method="dialog">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <div>
        <h1 className="font-bold text-2xl mb-4">
          {id ? "Edit TODO" : "Create TODO"}
        </h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="label">What you want to do?</p>
            <input
              type="text"
              placeholder="Type here"
              className="input w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="label">Priority</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <input
                  type="radio"
                  name={`priority-${id || "create"}`}
                  className="radio radio-xs"
                  checked={priority?.trim().toLowerCase() === "low"}
                  onChange={() => setPriority("low")}
                />
                <span className="label">Low</span>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="radio"
                  name={`priority-${id || "create"}`}
                  className="radio radio-xs"
                  checked={priority?.trim().toLowerCase() === "medium"}
                  onChange={() => setPriority("medium")}
                />
                <span className="label">Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="radio"
                  name={`priority-${id || "create"}`}
                  className="radio radio-xs"
                  checked={priority?.trim().toLowerCase() === "high"}
                  onChange={() => setPriority("high")}
                />
                <span className="label">High</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="label">Tags (comma separated)</p>
            <input
              type="text"
              placeholder="e.g. shopping, study, work"
              className="input w-full"
              value={tags}
              onChange={(e) => setTags(e.target.value.split(/,\s*/))}
            />
          </div>
          <div className="flex justify-end">
            <button
              className="btn btn-neutral rounded-sm"
              onClick={() =>
                id
                  ? editHandler(id, title, priority, tags)
                  : createHandler(title, priority, tags)
              }
            >
              {id ? "Save" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoModal;
