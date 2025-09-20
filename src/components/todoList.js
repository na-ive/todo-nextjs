"use client";

import { useState, useEffect, useCallback } from "react";
import TodoCard from "./todoCard";
import TodoModal from "./todoModal";
import { getTodos, getUniqueTags, supabase } from "@/lib/supabaseTD";

const TodoList = ({ initialData }) => {
  const [edit, setEdit] = useState(false);

  const [createTitle, setCreateTitle] = useState("");
  const [createPriority, setCreatePriority] = useState("low");
  const [createTags, setCreateTags] = useState([]);

  const [todos, setTodos] = useState(initialData);
  const [allTags, setAllTags] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchTags, setSearchTags] = useState([]);
  const [sortHighToLow, setSortHighToLow] = useState(true);

  const fetchTodos = useCallback(async () => {
    const data = await getTodos({
      searchTitle,
      searchTags,
      sortHighToLow,
    });
    setTodos(data);
  }, [searchTitle, searchTags, sortHighToLow]);

  const handleSuccess = () => {
    fetchTodos();
  };

  const toggleTag = (tag) => {
    setSearchTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

 useEffect(() => {
    const channel = supabase
      .channel("todoTabel-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "todoTabel" },
        () => {
          fetchTodos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTodos]);

  useEffect(() => {
    async function fetchTags() {
      try {
        const tags = await getUniqueTags();
        setAllTags(tags);
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    }

    fetchTags();
  }, []);

  return (
    <>
      <div className="sticky w-full top-16 bg-base-100 p-4 z-10">
        <div className="flex justify-center gap-4">
          <button
            className="btn btn-neutral rounded-sm"
            onClick={() => document.getElementById("createModal").showModal()}
            disabled={edit}
          >
            Create
          </button>
          <button
            className={`btn ${edit ? "btn-error" : "btn-neutral"} rounded-sm`}
            onClick={() => setEdit(!edit)}
          >
            {edit ? "Cancel" : "Edit/Delete"}
          </button>
        </div>
        <div className="flex justify-between items-center my-4 gap-2 md:mx-20">
          <div className="w-full">
            <label className="input w-full min-w-full !rounded-full">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input
                type="search"
                className="!rounded-full"
                required
                placeholder="Search"
                onChange={(e) => setSearchTitle(e.target.value)}
              />
            </label>
          </div>
          <div className="flex items-center gap-2">
            <div className="dropdown dropdown-bottom dropdown-center">
              <div tabIndex={0} role="button" className="btn rounded-md px-2">
                Tags
              </div>
              <div
                tabIndex={0}
                className="dropdown-content card card-sm bg-base-100 z-1 w-64 shadow-md"
              >
                <div className="card-body">
                  <form className="flex flex-wrap gap-2">
                    <input
                      className="btn btn-square rounded-md"
                      type="reset"
                      value="×"
                      onClick={() => setSearchTags([])}
                    />
                    {allTags.map((tag) => (
                      <input
                        className="btn rounded-md"
                        key={tag}
                        type="checkbox"
                        aria-label={tag}
                        onChange={() => toggleTag(tag)}
                      />
                    ))}
                  </form>
                </div>
              </div>
            </div>

            <label className="swap swap-rotate btn btn-square rounded-md">
              {/* hidden checkbox */}
              <input
                type="checkbox"
                onChange={() => setSortHighToLow(!sortHighToLow)}
              />

              {/* panah atas (ascending) */}
              <svg
                className="swap-on w-6 h-6 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5"
                />
              </svg>

              {/* panah bawah (descending) */}
              <svg
                className="swap-off w-6 h-6 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4"
                />
              </svg>
            </label>

            <button
              className="btn btn-accent btn-square rounded-md"
              onClick={() => handleSuccess()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="sm:flex sm:flex-wrap sm:gap-2 sm:justify-center md:mx-20">
        {todos.map((todo) => (
          <TodoCard
            key={todo.id}
            data={todo}
            edit={edit}
            onSuccess={handleSuccess}
          />
        ))}
      </div>

      <dialog id="createModal" className="modal">
        <TodoModal
          title={createTitle}
          setTitle={setCreateTitle}
          priority={createPriority}
          setPriority={setCreatePriority}
          tags={createTags}
          setTags={setCreateTags}
          onSuccess={handleSuccess}
        />
      </dialog>
    </>
  );
};

export default TodoList;
