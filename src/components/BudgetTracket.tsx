import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useBudget } from "../hooks/useBudget";
import AmountDisplay from "./AmountDisplay";
import "react-circular-progressbar/dist/styles.css";

export default function BudgetTracket() {
  const { state, dispatch, totalExpenses, remainingBudget } = useBudget();
  const percentage = +((totalExpenses / state.budget) * 100).toFixed(2);
  // console.log(percentage);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="flex justify-center">
        <CircularProgressbar
          value={percentage}
          styles={buildStyles({
            pathColor: percentage === 100 ? "#DC2626" : "#1f9f9f",
            trailColor: "#f5f5f5",
            textSize: 20,
            textColor: percentage === 100 ? "#DC2626" : "#1f9f9f",
          })}
          text={`${percentage}%`}
        />
      </div>
      <div className="flex flex-col justify-center items-center gap-8">
        <button
          type="button"
          className=" bg-pink-600 w-full p-2 text-white uppercase font-bold rounded-lg"
          onClick={() => dispatch({ type: "resetApp" })}
        >
          Resetear App
        </button>
        <AmountDisplay label="Presupuesto" amount={state.budget} />
        <AmountDisplay label="Disponible" amount={remainingBudget} />
        <AmountDisplay label="Gastado" amount={totalExpenses} />
      </div>
    </div>
  );
}
