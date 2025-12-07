// src/pages/MyTask.jsx

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { mockTaskData } from "../assets/assets";

const StatCard = ({ label, value, sub, icon }) => (
  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
    <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-lg">
      {icon}
    </div>
    <div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="text-xl font-bold text-slate-900 mt-1">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  </div>
);

const ProgressBar = ({ value, color }) => (
  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
    <div
      className="h-full rounded-full"
      style={{ width: `${value}%`, backgroundColor: color }}
    />
  </div>
);

const DistributionBar = ({ label, count, total, color }) => {
  const pct = total === 0 ? 0 : Math.round((count / total) * 100);
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">
          {count} · {pct}%
        </span>
      </div>
      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

const MyTask = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(auth === "true");
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Redirecting to login...</p>
      </div>
    );
  }

  const {
    summary,
    workloadByStatus,
    karmaImpact,
    monthlyTaskStats,
    upcomingSLA,
    tasks,
  } = mockTaskData;

  const totalWorkload = workloadByStatus.reduce(
    (sum, item) => sum + item.count,
    0
  );

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  const getStatusPill = (status) => {
    switch (status) {
      case "active":
        return "bg-blue-50 text-blue-700";
      case "pending-review":
        return "bg-amber-50 text-amber-700";
      case "completed":
        return "bg-emerald-50 text-emerald-700";
      case "rejected":
        return "bg-red-50 text-red-700";
      default:
        return "bg-slate-50 text-slate-700";
    }
  };

  const filterButtonClass = (value) =>
    `px-3 py-1.5 rounded-full text-xs font-medium border ${
      filter === value
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
    }`;

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <Navbar />
      <Sidebar />

      <main className="md:ml-64 mt-16 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
              <p className="text-sm text-slate-600 mt-1">
                Every completed task feeds your Karma Score and loan
                eligibility.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Synced to Karma Score model (mocked now, API later)</span>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <StatCard
              label="Total Tasks"
              value={summary.totalTasks}
              sub="Lifetime on Karma Passport"
              icon="📋"
            />
            <StatCard
              label="Active"
              value={summary.activeTasks}
              sub={`${summary.pendingReview} pending review`}
              icon="⚙️"
            />
            <StatCard
              label="Completed"
              value={summary.completedTasks}
              sub={`${summary.rejectedTasks} rejected`}
              icon="✅"
            />
            <StatCard
              label="Avg Rating"
              value={summary.avgTaskRating}
              sub="across completed tasks"
              icon="⭐"
            />
            <StatCard
              label="On-time Delivery"
              value={`${summary.avgOnTimeDeliveryRate}%`}
              sub="affects Karma heavily"
              icon="⏱️"
            />
            <StatCard
              label="Karma Contribution"
              value={`${summary.contributionToKarma}%`}
              sub="of your score comes from tasks"
              icon="🧠"
            />
          </div>

          {/* Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Workload by status */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-900 mb-1">
                Workload by Status
              </p>
              <p className="text-xs text-slate-500 mb-4">
                How your current task load is split.
              </p>
              {workloadByStatus.map((item) => (
                <DistributionBar
                  key={item.key}
                  label={item.status}
                  count={item.count}
                  total={totalWorkload}
                  color={item.color}
                />
              ))}
            </div>

            {/* Karma impact from tasks */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-900 mb-1">
                How Tasks Affect Karma
              </p>
              <p className="text-xs text-slate-500 mb-4">
                Each dimension feeds into your Karma Score model.
              </p>
              <div className="space-y-3">
                {karmaImpact.map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">
                        {item.label}
                      </span>
                      <span className="text-slate-500">
                        Score {item.score} · Weight {item.weight}%
                      </span>
                    </div>
                    <ProgressBar value={item.score} color="#3b82f6" />
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly task stats */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <p
                className="text-sm font-medium
// src/pages/MyTask.jsx  (continued)

              text-slate-900 mb-1"
              >
                Monthly Task Trend
              </p>
              <p className="text-xs text-slate-500 mb-4">
                Completion, delays and hours logged per month.
              </p>
              <div className="space-y-3">
                {monthlyTaskStats.map((m) => {
                  const maxCompleted = 12; // for visual scale
                  const completedWidth = Math.min(
                    (m.completed / maxCompleted) * 100,
                    100
                  );
                  const lateWidth = Math.min(
                    ((m.late || 0) / maxCompleted) * 100,
                    100
                  );
                  return (
                    <div key={m.month}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700">
                          {m.month}
                        </span>
                        <span className="text-slate-500">
                          {m.completed} completed · {m.late} late · {m.hours}h
                        </span>
                      </div>
                      <div className="flex gap-1 h-2">
                        <div
                          className="rounded-full bg-emerald-500"
                          style={{ width: `${completedWidth}%` }}
                        />
                        {m.late > 0 && (
                          <div
                            className="rounded-full bg-red-500"
                            style={{ width: `${lateWidth}%` }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-3 mt-4 text-[10px] text-slate-500">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span>Late</span>
                </div>
              </div>
            </div>
          </div>

          {/* SLA & Filters row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Upcoming SLA tasks */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Tasks Impacting Karma Soon
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Finish these on time to boost your Karma Passport.
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {upcomingSLA.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 p-3 rounded-lg border border-slate-100 hover:bg-slate-50"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {item.platform} · {item.type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 mb-1">
                        Due in {item.dueInHours}h
                      </p>
                      <div className="flex items-center gap-2 justify-end">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                          Karma impact {item.impactOnKarma}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            item.riskIfMissed === "High"
                              ? "bg-red-50 text-red-700"
                              : item.riskIfMissed === "Medium"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-50 text-slate-700"
                          }`}
                        >
                          {item.riskIfMissed} risk if missed
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter panel */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-900 mb-2">
                Task Filters
              </p>
              <p className="text-xs text-slate-500 mb-4">
                Focus on the right work state. Backend later can filter using
                query params.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setFilter("all")}
                  className={filterButtonClass("all")}
                >
                  All ({tasks.length})
                </button>
                <button
                  onClick={() => setFilter("active")}
                  className={filterButtonClass("active")}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilter("pending-review")}
                  className={filterButtonClass("pending-review")}
                >
                  Pending Review
                </button>
                <button
                  onClick={() => setFilter("completed")}
                  className={filterButtonClass("completed")}
                >
                  Completed
                </button>
                <button
                  onClick={() => setFilter("rejected")}
                  className={filterButtonClass("rejected")}
                >
                  Rejected
                </button>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Example future API:
                <br />
                <span className="font-mono bg-slate-100 px-2 py-1 rounded mt-1 inline-block">
                  GET /tasks?status={"{"}
                  {"{"}status{"}"}
                </span>
              </p>
            </div>
          </div>

          {/* Task table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                Tasks ({filteredTasks.length})
              </h3>
              <p className="text-xs text-slate-500">
                {filter === "all"
                  ? "All tasks linked to your Karma Passport"
                  : `Showing ${filter.replace("-", " ")} tasks`}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-3 text-left font-medium text-slate-700">
                      Task
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-slate-700">
                      Platform
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-slate-700">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-slate-700">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-slate-700">
                      Hours
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-slate-700">
                      Payout
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-slate-700">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-slate-700">
                      Karma Link
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-slate-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition"
                    >
                      <td className="px-6 py-4 align-top">
                        <p className="font-semibold text-slate-900">
                          {task.title}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Created{" "}
                          {new Date(task.createdAt).toLocaleDateString()} · Due{" "}
                          {new Date(task.dueAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4 align-top text-slate-700">
                        {task.platform}
                      </td>
                      <td className="px-6 py-4 align-top text-slate-700">
                        {task.category}
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="flex items-center gap-2">
                          <div className="w-28">
                            <ProgressBar
                              value={task.progress}
                              color={
                                task.status === "completed"
                                  ? "#10b981"
                                  : "#3b82f6"
                              }
                            />
                          </div>
                          <span className="text-xs text-slate-600">
                            {task.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top text-slate-700">
                        <p className="text-sm">
                          {task.hoursLogged}/{task.hoursEstimated}h
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {task.onTimeSLA ? "On-time SLA" : "SLA risk"}
                        </p>
                      </td>
                      <td className="px-6 py-4 align-top text-slate-700">
                        {task.payoutUsd > 0 ? (
                          <p className="font-semibold">${task.payoutUsd}</p>
                        ) : (
                          <p className="text-xs text-slate-400">N/A</p>
                        )}
                      </td>
                      <td className="px-6 py-4 align-top text-slate-700">
                        {task.rating ? (
                          <p className="text-xs text-amber-600 font-medium">
                            ⭐ {task.rating}
                          </p>
                        ) : (
                          <p className="text-xs text-slate-400">—</p>
                        )}
                      </td>
                      <td className="px-6 py-4 align-top">
                        {task.affectsKarma ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700">
                            🔗 Counts to Karma
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-50 text-slate-500">
                            ⏺ Neutral
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 align-top">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold ${getStatusPill(
                            task.status
                          )}`}
                        >
                          {task.status === "active" && "● Active"}
                          {task.status === "pending-review" && "⏳ Pending"}
                          {task.status === "completed" && "✓ Completed"}
                          {task.status === "rejected" && "✕ Rejected"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredTasks.length === 0 && (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-6 py-10 text-center text-sm text-slate-500"
                      >
                        No tasks in this state right now.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-slate-500">
            Frontend is fully mocked. Later, backend can plug in with{" "}
            <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">
              GET /tasks
            </span>{" "}
            and{" "}
            <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">
              GET /tasks/karma-impact
            </span>{" "}
            to replace mockTaskData without changing UI.
          </p>
        </div>
      </main>
    </div>
  );
};

export default MyTask;
