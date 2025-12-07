// src/pages/Loans.jsx

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { mockLoanData } from "../assets/assets";
import { mockUserData } from "../assets/assets";

const Loans = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [step, setStep] = useState("idle"); // idle | form | submitted
  const [amount, setAmount] = useState(mockLoanData.recommendedAmount);
  const [duration, setDuration] = useState(30);
  const [showMaxReached, setShowMaxReached] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(auth === "true");
  }, []);

  useEffect(() => {
    if (mockLoanData.activeLoansCount >= mockLoanData.maxActiveLoansAllowed) {
      setShowMaxReached(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Redirecting to login...</p>
      </div>
    );
  }

  const {
    tier,
    karmaScore,
    baseCurrency,
    maxApprovalLimit,
    minLoanAmount,
    availableDurations,
    interestConfig,
    activeLoansCount,
    maxActiveLoansAllowed,
  } = mockLoanData;

  const isEligible = karmaScore >= 70;
  const maxAmountForUser = isEligible ? maxApprovalLimit : 0;

  // choose interest rate based on score
  const interestRateMonthly =
    karmaScore >= 80
      ? interestConfig.highScoreRate
      : karmaScore >= 70
      ? interestConfig.midScoreRate
      : interestConfig.lowScoreRate;

  const principal = amount || 0;
  const months = duration / 30;
  const interestAmount = Math.round(
    (principal * (interestRateMonthly / 100)) * months
  );
  const totalRepayable = principal + interestAmount;

  const today = new Date();
  const dueDate = new Date(today.getTime() + duration * 24 * 60 * 60 * 1000);
  const formattedDueDate = dueDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const handleApplyClick = () => {
    if (!isEligible) return;
    if (activeLoansCount >= maxActiveLoansAllowed) {
      setShowMaxReached(true);
      return;
    }
    setStep("form");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In future: call backend /loan/apply API here
    setStep("submitted");
  };

  const resetToDashboard = () => {
    setStep("idle");
  };

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <Navbar />
      <Sidebar />

      <main className="md:ml-64 mt-16 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Instant Loans
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Use your Karma Score to unlock small, flexible loans in minutes.
              </p>
            </div>
            <div className="flex flex-col items-end text-xs text-slate-500">
              <span className="font-medium">
                Tier:{" "}
                <span className="text-emerald-600 font-semibold">{tier}</span>
              </span>
              <span>
                Karma Score:{" "}
                <span className="font-semibold text-slate-900">
                  {mockUserData.karmaScore.score}
                </span>
              </span>
            </div>
          </div>

          {/* Apply card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Apply for Instant Loan
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Get funds in minutes with your verified Karma Passport score.
                </p>
              </div>
              <button
                onClick={handleApplyClick}
                disabled={!isEligible}
                className={`px-6 py-2 rounded-lg text-sm font-semibold shadow-sm transition ${
                  isEligible
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-slate-200 text-slate-500 cursor-not-allowed"
                }`}
              >
                {isEligible
                  ? "Start Loan Application"
                  : "Score too low for loan"}
              </button>
            </div>

            {/* Eligibility banner */}
            <div className="mt-2 text-xs text-slate-600">
              <p>
                Minimum Karma Score required:{" "}
                <span className="font-semibold">70</span>. Your current score:{" "}
                <span className="font-semibold">
                  {mockUserData.karmaScore.score}
                </span>
                .
              </p>
              <p className="mt-1">
                Approved limit (mocked):{" "}
                <span className="font-semibold">
                  {baseCurrency}
                  {maxAmountForUser.toLocaleString("en-IN")}
                </span>{" "}
                · Active loans:{" "}
                <span className="font-semibold">
                  {activeLoansCount}/{maxActiveLoansAllowed}
                </span>
              </p>
            </div>
          </div>

          {/* Loan form (only if step === 'form') */}
          {step === "form" && (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 mb-6"
            >
              {/* Title */}
              <div className="text-center mb-8">
                <div className="h-12 w-12 mx-auto rounded-2xl bg-emerald-100 flex items-center justify-center mb-3">
                  <span className="text-2xl">💸</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Instant Loan Application
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Your tier:{" "}
                  <span className="font-semibold text-emerald-600">{tier}</span>{" "}
                  · Interest rate:{" "}
                  <span className="font-semibold">
                    {interestRateMonthly}% monthly
                  </span>
                </p>
              </div>

              {/* Loan amount */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-700">
                    Loan Amount
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Max: {baseCurrency}
                    {maxApprovalLimit.toLocaleString("en-IN")}
                  </p>
                </div>
                <input
                  type="number"
                  value={amount}
                  min={minLoanAmount}
                  max={maxApprovalLimit}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (v < minLoanAmount) setAmount(minLoanAmount);
                    else if (v > maxApprovalLimit) setAmount(maxApprovalLimit);
                    else setAmount(v);
                  }}
                  className="w-full px-4 py-2.5 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-slate-900"
                />
                <div className="flex justify-between mt-2 text-[11px] text-slate-500">
                  <span>
                    {baseCurrency}
                    {minLoanAmount.toLocaleString("en-IN")}
                  </span>
                  <span>
                    {baseCurrency}
                    {maxApprovalLimit.toLocaleString("en-IN")}
                  </span>
                </div>
                <input
                  type="range"
                  min={minLoanAmount}
                  max={maxApprovalLimit}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full mt-2 accent-purple-500"
                />
              </div>

              {/* Duration */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-slate-700 mb-2">
                  Loan Duration
                </p>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-slate-900"
                >
                  {availableDurations.map((d) => (
                    <option key={d} value={d}>
                      {d} days
                    </option>
                  ))}
                </select>
              </div>

              {/* Summary */}
              <div className="mb-6">
                <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5">
                  <p className="text-sm font-semibold text-purple-700 mb-3">
                    Loan Summary
                  </p>
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>Loan Amount</span>
                    <span>
                      {baseCurrency}
                      {principal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>
                      Interest ({interestRateMonthly}% monthly · approx.)
                    </span>
                    <span className="text-orange-500 font-semibold">
                      {baseCurrency}
                      {interestAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-purple-100">
                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        Total Repayable
                      </p>
                      <p className="text-lg font-bold text-emerald-600">
                        {baseCurrency}
                        {totalRepayable.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-slate-500">Due Date</p>
                      <p className="text-xs font-semibold text-slate-800">
                        {formattedDueDate}
                      </p>
                      <p className="text-[11px] text-purple-600 mt-1">
                        {tier} rate applied
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold shadow-md flex items-center justify-center gap-2"
              >
                ⚡ Apply for Instant Loan
              </button>

              {/* Footer badges */}
              <div className="mt-4 flex flex-wrap justify-center gap-4 text-[11px] text-slate-500">
                <div className="flex items-center gap-1">
                  <span>✅</span>
                  <span>No Hidden Fees</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🔒</span>
                  <span>SSL Secured (mock)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>⚡</span>
                  <span>Instant Approval (demo)</span>
                </div>
              </div>
            </form>
          )}

          {/* Max active loans notice */}
          {showMaxReached && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
              <p className="font-semibold mb-1">
                Maximum Active Loans Reached
              </p>
              <p>
                You have reached the maximum number of active loans (
                {maxActiveLoansAllowed}). Please repay existing loans before
                applying for new ones. (This is mocked info for the demo.)
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Submission modal */}
      {step === "submitted" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-xl">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-lg font-bold text-emerald-700 mb-2">
                Application Submitted!
              </h3>
              <p className="text-xs text-slate-600 mb-4">
                Successfully submitted application for{" "}
                <span className="font-semibold">
                  {baseCurrency}
                  {principal.toLocaleString("en-IN")}
                </span>
                . Total repayable is{" "}
                <span className="font-semibold">
                  {baseCurrency}
                  {totalRepayable.toLocaleString("en-IN")}
                </span>
                . Due date:{" "}
                <span className="font-semibold">{formattedDueDate}</span>.
              </p>
              <button
                onClick={resetToDashboard}
                className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold mt-2"
              >
                Back to Loans Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loans;
