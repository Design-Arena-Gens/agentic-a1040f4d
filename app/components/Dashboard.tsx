import { Transaction, Budget, Goal, Debt } from "../types";
import { format } from "date-fns";

interface DashboardProps {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  debts: Debt[];
}

export default function Dashboard({ transactions, budgets, goals, debts }: DashboardProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const totalIncome = monthlyTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = Math.abs(
    monthlyTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const netIncome = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((netIncome / totalIncome) * 100).toFixed(1) : "0";

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalBudgetSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const budgetRemaining = totalBudget - totalBudgetSpent;

  const totalGoalsTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalGoalsCurrent = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const goalsProgress = totalGoalsTarget > 0 ? ((totalGoalsCurrent / totalGoalsTarget) * 100).toFixed(1) : "0";

  const totalDebt = debts.reduce((sum, d) => sum + d.remainingAmount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Financial Overview</h2>
        <p className="text-gray-600">Current Month: {format(new Date(), "MMMM yyyy")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Income</p>
              <p className="text-3xl font-bold mt-2">${totalIncome.toFixed(2)}</p>
            </div>
            <div className="text-4xl opacity-80">💵</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Total Expenses</p>
              <p className="text-3xl font-bold mt-2">${totalExpenses.toFixed(2)}</p>
            </div>
            <div className="text-4xl opacity-80">💸</div>
          </div>
        </div>

        <div className={`bg-gradient-to-br ${netIncome >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} rounded-lg p-6 text-white shadow-md`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Net Income</p>
              <p className="text-3xl font-bold mt-2">${netIncome.toFixed(2)}</p>
            </div>
            <div className="text-4xl opacity-80">💰</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Savings Rate</p>
              <p className="text-3xl font-bold mt-2">{savingsRate}%</p>
            </div>
            <div className="text-4xl opacity-80">🎯</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Budget Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Budget:</span>
              <span className="font-semibold">${totalBudget.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Spent:</span>
              <span className="font-semibold text-red-600">${totalBudgetSpent.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Remaining:</span>
              <span className="font-semibold text-green-600">${budgetRemaining.toFixed(2)}</span>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${totalBudgetSpent / totalBudget > 0.9 ? 'bg-red-500' : totalBudgetSpent / totalBudget > 0.7 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min((totalBudgetSpent / totalBudget) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                {((totalBudgetSpent / totalBudget) * 100).toFixed(1)}% used
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Goals Progress</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Target:</span>
              <span className="font-semibold">${totalGoalsTarget.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Saved:</span>
              <span className="font-semibold text-green-600">${totalGoalsCurrent.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Remaining:</span>
              <span className="font-semibold">${(totalGoalsTarget - totalGoalsCurrent).toFixed(2)}</span>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${Math.min((totalGoalsCurrent / totalGoalsTarget) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                {goalsProgress}% achieved
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Debt Overview</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Debt:</span>
              <span className="font-semibold text-red-600">${totalDebt.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Accounts:</span>
              <span className="font-semibold">{debts.length}</span>
            </div>
            {debts.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-2">Next Payments Due:</p>
                {debts.slice(0, 2).map(debt => (
                  <div key={debt.id} className="text-xs text-gray-700 mb-1">
                    • {debt.name}: ${debt.minimumPayment.toFixed(2)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
        {monthlyTransactions.length > 0 ? (
          <div className="space-y-2">
            {monthlyTransactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(transaction.date), "MMM dd, yyyy")} • {transaction.category}
                  </p>
                </div>
                <div className={`text-lg font-bold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                  {transaction.type === "income" ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No transactions this month</p>
        )}
      </div>
    </div>
  );
}
