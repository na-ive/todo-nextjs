"use client";

import React from "react";
import TodoModal from "./todoModal";
import { updateTodoCompleted, deleteTodo } from "@/lib/supabaseTD";

const TodoCard = ({ data, edit, onSuccess }) => {
  const [id, setId] = React.useState(0);
  const [title, setTitle] = React.useState("");
  const [priority, setPriority] = React.useState("");
  const [tags, setTags] = React.useState([]);

  const completedHandler = async (id, newStatus) => {
    try {
      await updateTodoCompleted(id, newStatus);
      // Memanggil fungsi dari induk untuk me-refresh semua data
      onSuccess();
    } catch (error) {
      console.error("Update completed status error:", error);
    }
  };

  const deleteHandler = async (id) => {
    try {
      await deleteTodo(id);
      onSuccess();
      document.getElementById("deleteTodo").close();
    } catch (error) {
      console.error("Delete todo error:", error);
    }
  };

  const { id: todoId, is_completed, title: todoTitle, metadata } = data;
  const { priority: todoPriority, tags: todoTags } = metadata;

  return (
    <>
        <div
          key={todoId}
          className="card rounded-sm bg-base-200 border-2 border-base-300 text-base-content my-2 sm:my-0"
        >
          <div className="card-body p-0 gap-0">
            <div
              className={`flex m-0 justify-end items-center bg-base-100 label px-2 pt-1 text-xs ${
                !edit ? "hidden" : ""
              } `}
            >
              <button
                className="btn btn-ghost"
                data-id={todoId}
                onClick={() => {
                  setId(todoId);
                  setTitle(todoTitle);
                  setPriority(todoPriority);
                  setTags(todoTags);
                  document.getElementById("editTodo").showModal();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"
                  className="fill-current"
                  width="16"
                  height="16"
                >
                  <path d="M100.4 417.2C104.5 402.6 112.2 389.3 123 378.5L304.2 197.3L338.1 163.4C354.7 180 389.4 214.7 442.1 267.4L476 301.3L442.1 335.2L260.9 516.4C250.2 527.1 236.8 534.9 222.2 539L94.4 574.6C86.1 576.9 77.1 574.6 71 568.4C64.9 562.2 62.6 553.3 64.9 545L100.4 417.2zM156 413.5C151.6 418.2 148.4 423.9 146.7 430.1L122.6 517L209.5 492.9C215.9 491.1 221.7 487.8 226.5 483.2L155.9 413.5zM510 267.4C493.4 250.8 458.7 216.1 406 163.4L372 129.5C398.5 103 413.4 88.1 416.9 84.6C430.4 71 448.8 63.4 468 63.4C487.2 63.4 505.6 71 519.1 84.6L554.8 120.3C568.4 133.9 576 152.3 576 171.4C576 190.5 568.4 209 554.8 222.5C551.3 226 536.4 240.9 509.9 267.4z" />
                </svg>
                Edit
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setId(todoId);
                  document.getElementById("deleteTodo").showModal();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"
                  className="fill-current"
                  width="16"
                  height="16"
                >
                  <path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z" />
                </svg>
                Delete
              </button>
            </div>
            <div className="rounded-sm flex justify-between items-center sm:w-[600px] gap-2 sm:gap-6 bg-base-100 p-8">
              <h1 className="text-lg sm:text-2xl">{todoTitle}</h1>
              <input
                type="checkbox"
                checked={is_completed}
                onChange={(event) => completedHandler(todoId, event.target.checked)}
                className="checkbox checkbox-xl"
              />
            </div>
            <div className="px-8 p-2 flex flex-col sm:flex-row justify-start sm:justify-between items-center gap-2 sm:gap-0">
              <div className="flex flex-wrap gap-2">
                {todoTags.map((t) => (
                  <div
                    key={t}
                    className="p-2 px-4 bg-base-100 rounded-sm capitalize"
                  >
                    {t}
                  </div>
                ))}
              </div>
              <h4 className="text-sm sm:text-lg capitalize">
                Priority: {todoPriority}
              </h4>
            </div>
          </div>
        </div>

      <dialog id="editTodo" className="modal">
        <TodoModal
          id={id}
          title={title}
          priority={priority}
          tags={tags}
          setTitle={setTitle}
          setPriority={setPriority}
          setTags={setTags}
          onSuccess={onSuccess}
        />
      </dialog>

      <dialog id="deleteTodo" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete?</h3>
          <p className="py-4">
            Delete this TODO? (This action cannot be undone)
          </p>
          <div className="modal-action">
            <button className="btn btn-error" onClick={() => deleteHandler(id)}>
              Delete
            </button>
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default TodoCard;
