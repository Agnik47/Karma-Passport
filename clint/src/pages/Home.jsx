// src/pages/Home.jsx

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { mockUserData } from "../assets/assets";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Flame,
  Star,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  Shield,
  Zap,
  Award,
  Calendar,
  Download,
  Eye,
  Users,
  Target,
  BarChart3,
} from "lucide-react";

// Simplified Components
const StatCard = ({ label, value, change, Icon, color }) => (
  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm text-slate-500 mb-1">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
      <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}15` }}>
        <Icon style={{ color }} size={20} />
      </div>
    </div>
    {change && (
      <div className="flex items-center text-sm">
        <TrendingUp
          size={14}
          className={change > 0 ? "text-emerald-500 mr-1" : "text-red-500 mr-1"}
        />
        <span className={change > 0 ? "text-emerald-600" : "text-red-600"}>
          {change > 0 ? "+" : ""}
          {change}% from last month
        </span>
      </div>
    )}
  </div>
);

const ScoreGauge = ({ score, riskCategory, loanLimit }) => {
  const getColor = () => {
    if (score >= 70) return "#3b82f6";
    if (score >= 50) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Karma Score</h3>
          <p className="text-sm text-slate-500">Your trustworthiness score</p>
        </div>
        <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
          {riskCategory} Risk
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="relative w-48 h-48 mx-auto">
          <div className="absolute inset-0 flex items-center justify-center">
            <div>
              <div className="text-5xl font-bold text-slate-900">{score}</div>
              <div className="text-sm text-slate-500">out of 100</div>
            </div>
          </div>
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full transform -rotate-90"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="10"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={getColor()}
              strokeWidth="10"
              strokeDasharray={`${(score / 100) * 283} 283`}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">Loan Limit</span>
          <span className="text-xl font-bold text-emerald-600">
            ${loanLimit}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${score}%`, backgroundColor: getColor() }}
          />
        </div>
      </div>
    </div>
  );
};

const AgentCard = ({ agent }) => (
  <div className="bg-white rounded-lg p-4 border border-slate-200 hover:border-blue-300 transition">
    <div className="flex justify-between items-start mb-3">
      <div>
        <h4 className="font-medium text-slate-900 text-sm mb-1">
          {agent.name}
        </h4>
        <p className="text-xs text-slate-500">{agent.description}</p>
      </div>
      <span className="text-lg font-bold text-slate-900">{agent.score}%</span>
    </div>
    <div className="space-y-2">
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${agent.score}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 text-right">
        Weight: {agent.weight}%
      </p>
    </div>
  </div>
);

const LogDeliveryProofModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    platform: "Upwork",
    numberOfTasks: "",
    averageRating: "",
    totalHours: "",
    shiftDetails: "",
    description: "",
    attachmentUrl: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      platform: "Upwork",
      numberOfTasks: "",
      averageRating: "",
      totalHours: "",
      shiftDetails: "",
      description: "",
      attachmentUrl: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Log Delivery Proof
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Record your completed work
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Platform
            </label>
            <select
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Upwork</option>
              <option>Fiverr</option>
              <option>GitHub</option>
              <option>Direct Client</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Tasks
              </label>
              <input
                type="number"
                name="numberOfTasks"
                value={formData.numberOfTasks}
                onChange={handleChange}
                placeholder="Number of tasks"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Rating
              </label>
              <input
                type="number"
                name="averageRating"
                value={formData.averageRating}
                onChange={handleChange}
                placeholder="Average rating"
                step="0.1"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Hours
            </label>
            <input
              type="number"
              name="totalHours"
              value={formData.totalHours}
              onChange={handleChange}
              placeholder="Total hours worked"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the work completed..."
              rows="3"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Proof Link
            </label>
            <input
              type="url"
              name="attachmentUrl"
              value={formData.attachmentUrl}
              onChange={handleChange}
              placeholder="GitHub or proof link"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            <Upload size={18} />
            Submit Proof
          </button>
        </form>
      </div>
    </div>
  );
};

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submissions, setSubmissions] = useState(
    mockUserData.workProofSubmissions
  );

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(auth === "true");
  }, []);

  const handleSubmitProof = (formData) => {
    const newSubmission = {
      id: `PROOF-${Date.now()}`,
      title: formData.description.split("\n")[0],
      description: formData.description,
      platform: formData.platform,
      numberOfTasks: parseInt(formData.numberOfTasks),
      totalHours: parseInt(formData.totalHours),
      attachmentUrl: formData.attachmentUrl,
      averageRating: parseFloat(formData.averageRating),
      shiftDetails: formData.shiftDetails,
      submittedAt: new Date().toISOString(),
      status: "pending",
      karmaPointsEarned: Math.floor(Math.random() * 46) + 5,
    };

    setSubmissions([newSubmission, ...submissions]);
    setIsModalOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Redirecting to login...</p>
      </div>
    );
  }

  const data = mockUserData;
  const agents = Object.values(data.agentScores);
  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <Navbar />
      <Sidebar />

      <main className="md:ml-64 mt-16 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              Welcome back, {data.user.name}! 👋
            </h1>
            <p className="text-slate-600">Your Karma Passport dashboard</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Tasks Completed"
              value={data.workStats.totalTasksCompleted}
              change={25}
              Icon={CheckCircle}
              color="#10b981"
            />
            <StatCard
              label="Total Earnings"
              value={`$${data.workStats.totalEarningsUsd}`}
              change={30}
              Icon={DollarSign}
              color="#3b82f6"
            />
            <StatCard
              label="Active Streak"
              value={`${data.workStats.activeStreak} days`}
              change={15}
              Icon={Flame}
              color="#f97316"
            />
            <StatCard
              label="Average Rating"
              value={data.workStats.avgRating}
              change={10}
              Icon={Star}
              color="#f59e0b"
            />
          </div>

          {/* Score & Agents */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <ScoreGauge
              score={data.karmaScore.score}
              riskCategory={data.karmaScore.riskCategory}
              loanLimit={data.karmaScore.loanLimitUsd}
            />
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    AI Agent Scores
                  </h3>
                  <Shield size={20} className="text-blue-500" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {agents.map((agent, idx) => (
                    <AgentCard key={idx} agent={agent} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">
                  Score Progression
                </h3>
                <BarChart3 size={20} className="text-blue-500" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.chartData.scoreProgression}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="week" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#3b82f6"
                      fill="#3b82f620"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">
                  Earnings History
                </h3>
                <DollarSign size={20} className="text-emerald-500" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.chartData.earningsHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Bar
                      dataKey="amount"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Log Work Proof */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Zap size={24} />
                    <h2 className="text-xl font-bold">Log Delivery Proof</h2>
                  </div>
                  <p className="text-blue-100">
                    Submit work proof to increase your Karma Score
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition flex items-center gap-2"
                >
                  <Upload size={18} />
                  Add Proof
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LogDeliveryProofModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitProof}
      />
    </div>
  );
};

export default Home;
