import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-date-picker";
import ErrorMessage from "./ErrorMessage";
import type { DraftExpense, Value } from "../types";
import { ChangeEvent, useEffect, useState } from "react";
import { categories } from "../data/categories";
import { useBudget } from "../hooks/useBudget";

export default function ExpenseForm() {
  const [expense, setExpense] = useState<DraftExpense>({
    expenseName: "",
    amount: 0,
    category: "",
    date: new Date(),
  });

  const [error, setError] = useState("");
  const [previousAmount, setPreviousAmount] = useState(0);
  const { dispatch, state, remainingBudget } = useBudget();

  useEffect(() => {
    if (state.editingId) {
      const editingExpense = state.expenses.filter(
        (currentExpense) => currentExpense.id === state.editingId
      )[0];
      setExpense(editingExpense);
      setPreviousAmount(editingExpense.amount);
    }
  }, [state.editingId, state.expenses]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const isAmountField = ["amount"].includes(name);
    setExpense({
      ...expense,
      [name]: isAmountField ? Number(value) : value,
    });
  };

  const handleChangeDate = (value: Value) => {
    setExpense({
      ...expense,
      date: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.values(expense).includes("")) {
      setError("Todos los campos son obligatorios");
      return;
    }

    //validamos limite de presupuesto

    if (expense.amount - previousAmount > remainingBudget) {
      setError("Limite de presupuesto alcansado!");
      return;
    }

    if (state.editingId) {
      dispatch({
        type: "updateExpense",
        payload: { expense: { id: state.editingId, ...expense } },
      });
    } else {
      dispatch({ type: "add-expense", payload: { expense } });
    }

    // setExpense({
    // //   expenseName: "",
    // //   amount: 0,
    // //   category: "",
    // //   date: new Date(),
    // });

    setPreviousAmount(0);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <legend className=" uppercase text-center text-2xl font-black border-b-4 border-blue-500">
        {state.editingId ? "Actualizar Gasto" : "Nuevo Gasto"}
      </legend>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <div className="flex flex-col gap-2">
        <label htmlFor="expenseName" className="text-xl">
          Nombre Gasto:
        </label>
        <input
          type="text"
          id="expenseName"
          placeholder="Añade el nombre del gasto"
          className="bg-slate-100 p-2"
          name="expenseName"
          onChange={handleChange}
          value={expense.expenseName}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="text-xl">
          Cantidad:
        </label>
        <input
          type="number"
          id="amount"
          placeholder="Añade cantidad del casto: ej. 300"
          className="bg-slate-100 p-2"
          name="amount"
          onChange={handleChange}
          value={expense.amount}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="text-xl">
          Categoria:
        </label>
        <select
          id="category"
          className="bg-slate-100 p-2"
          name="category"
          onChange={handleChange}
          value={expense.category}
        >
          <option value="">-- Seleccione --</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="text-xl">
          Fecha Gasto:
        </label>
        <DatePicker
          className="bg-slate-100 p-2 border-0"
          value={expense.date}
          // onChange={(date) => setExpense({ ...expense, date })}
          onChange={handleChangeDate}
        />
      </div>

      <input
        type="submit"
        className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
        value={state.editingId ? "Guardar Cambios" : "Registrar Gastos"}
      />
    </form>
  );
}
