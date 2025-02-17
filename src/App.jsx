import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function BudgetPlanner() {
    const [income, setIncome] = useState("");
    const [savings, setSavings] = useState(0);
    const [extraExpenses, setExtraExpenses] = useState({
        Rent: 0,
        Food: 0,
        Miscellaneous: 0,
    });
    const [newExpense, setNewExpense] = useState({ category: "", amount: "" });
    const [deleteExpense, setDeleteExpense] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [editExpense, setEditExpense] = useState({ category: "", newAmount: "" });
    const [showPopup, setShowPopup] = useState(false);

    const calculateBudget = (income) => {
        const savings = Math.floor(income * 0.3);
        const expenseBudget = income - savings;
        const rent = Math.floor(expenseBudget * 0.2);  // Increased Rent percentage for more realistic example
        const food = Math.floor(expenseBudget * 0.25); // Increased Food percentage for more realistic example
        const miscellaneous = expenseBudget - rent - food;

        return { Rent: rent, Food: food, Miscellaneous: miscellaneous, Savings: savings };
    };

    useEffect(() => {
        if (income > 0) {
            const initialBudget = calculateBudget(income);
            setSavings(initialBudget.Savings);
            setExtraExpenses({
                Rent: initialBudget.Rent,
                Food: initialBudget.Food,
                Miscellaneous: initialBudget.Miscellaneous,
            });
        }
    }, [income]);

    const handleIncomeSubmit = () => {
        if (income > 0) {
            setSubmitted(true);
        } else {
            alert("Income must be a positive number.");
        }
    };

    const handleAddExpense = () => {
        const category = newExpense.category.trim();
        const amount = Number(newExpense.amount);

        if (category && amount > 0) {
            if (amount > extraExpenses.Miscellaneous) {
                setShowPopup(true);
            } else {
                setExtraExpenses((prev) => ({
                    ...prev,
                    [category]: (prev[category] || 0) + amount,
                    Miscellaneous: prev.Miscellaneous - amount,
                }));
                setNewExpense({ category: "", amount: "" });
            }
        } else {
            alert("Enter a valid category and amount.");
        }
    };

    const handleDeleteExpense = () => {
        const category = deleteExpense.trim();
        if (category in extraExpenses && category !== "Miscellaneous") {
            const deletedAmount = extraExpenses[category];

            setExtraExpenses((prev) => {
                const updatedExpenses = { ...prev };
                delete updatedExpenses[category];

                return {
                    ...updatedExpenses,
                    Miscellaneous: prev.Miscellaneous + deletedAmount,
                };
            });

            setDeleteExpense("");
        } else {
            alert("Expense category not found.");
        }
    };

    const handleAmountChange = (category, newAmount) => {
        if (newAmount >= 0) {
            const diffAmount = newAmount - extraExpenses[category];
            if (diffAmount > 0 && diffAmount > extraExpenses.Miscellaneous) {
                setShowPopup(true);
            } else {
                setExtraExpenses((prev) => ({
                    ...prev,
                    [category]: newAmount,
                    Miscellaneous: prev.Miscellaneous - diffAmount,
                }));
            }
        }
    };

    const handleEditExpenseChange = (category, newAmount) => {
        setEditExpense({ category, newAmount });
    };

    return (
        <div className="app-container">
            {showPopup && (
                <div className="popup">
                    <button className="btn btn-warning" onClick={() => setShowPopup(false)}>
                        Budget Exceeds Edit Your Expense to continue..
                    </button>
                </div>
            )}
            <div className="card-box">
                <div className="row">
                    <div className="col-md-6">
                        <h4 className="text-center mb-3">Enter Your Monthly Income</h4>
                        <input
                            type="number"
                            className="form-control input-custom"
                            placeholder="Enter income amount"
                            value={income}
                            onChange={(e) => setIncome(Number(e.target.value))}
                        />
                        <button className="btn btn-primary btn-custom" onClick={handleIncomeSubmit}>
                            Submit
                        </button>
                    </div>

                    <div className="col-md-6">
                        {submitted && (
                            <>
                                <h4 className="text-center mb-3">Suggested Budget</h4>
                                <ul className="list-group">
                                    {Object.entries(extraExpenses).map(([category, amount]) => (
                                        category !== "Miscellaneous" && (
                                            <li key={category} className="list-group-item d-flex justify-content-between">
                                                {category !== "Miscellaneous" ? (
                                                    <>
                                                        <span>{category}: </span>
                                                        <span
                                                            onClick={() => handleEditExpenseChange(category, amount)}
                                                            style={{ cursor: "pointer", fontWeight: "bold" }}
                                                        >
                                                            ₹{amount}
                                                        </span>
                                                        {editExpense.category === category && (
                                                            <input
                                                                type="number"
                                                                value={editExpense.newAmount}
                                                                onChange={(e) =>
                                                                    setEditExpense({ ...editExpense, newAmount: e.target.value })
                                                                }
                                                                onBlur={() => {
                                                                    handleAmountChange(category, Number(editExpense.newAmount));
                                                                    setEditExpense({ category: "", newAmount: "" });
                                                                }}
                                                                onKeyPress={(e) => {
                                                                    if (e.key === "Enter") {
                                                                        handleAmountChange(category, Number(editExpense.newAmount));
                                                                        setEditExpense({ category: "", newAmount: "" });
                                                                    }
                                                                }}
                                                                autoFocus
                                                            />
                                                        )}
                                                    </>
                                                ) : null}
                                            </li>
                                        )
                                    ))}
                                    <li className="list-group-item d-flex justify-content-between">
                                        <strong>Miscellaneous: ₹{extraExpenses.Miscellaneous}</strong>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between">
                                        <strong>Savings (30%): ₹{savings}</strong>
                                    </li>
                                </ul>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {submitted && (
                <div className="card-box">
                    <div className="row">
                        <div className="col-md-6">
                            <h4 className="text-center mb-3">Add Extra Expenses</h4>
                            <input
                                type="text"
                                placeholder="Expense category"
                                className="form-control input-custom"
                                value={newExpense.category}
                                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Amount"
                                className="form-control input-custom"
                                value={newExpense.amount}
                                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                            />
                            <button className="btn btn-success btn-custom" onClick={handleAddExpense}>
                                Add Expense
                            </button>
                        </div>

                        <div className="col-md-6">
                            <h4 className="text-center mb-3">Delete Expense</h4>
                            <input
                                type="text"
                                placeholder="Expense category"
                                className="form-control input-custom"
                                value={deleteExpense}
                                onChange={(e) => setDeleteExpense(e.target.value)}
                            />
                            <button className="btn btn-danger btn-custom" onClick={handleDeleteExpense}>
                                Delete Expense
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
}

export default BudgetPlanner;
