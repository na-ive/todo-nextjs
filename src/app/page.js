import TodoList from "@/components/todoList";
import { getTodos } from "@/lib/supabaseTD";

export default async function Home() {
  const initialTodos = await getTodos({sortHighToLow: true});
  return (
    <div className="font-sans grid items-center justify-items-center p-8 pb-20 gap-8">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="w-full">
          <div className="flex justify-center items-center gap-2 text-4xl font-bold">
            TODOs
            <div className="flex px-4 py-2 rounded-sm justify-between items-center gap-4 bg-base-100 border-2 border-base-300 text-base-content my-2 -rotate-4">
              <h1 className="text-lg sm:text-2xl">na-ive</h1>
              <input
                type="checkbox"
                defaultChecked={true}
                className="checkbox"
              />
            </div>
          </div>
          <h3 className="text-center text-lg font-light">
            TODOS Apps With Next.js + supabase
          </h3>
          <TodoList initialData={initialTodos} />
        </div>
      </main>
    </div>
  );
}
