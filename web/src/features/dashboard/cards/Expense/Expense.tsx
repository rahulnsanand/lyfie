import React, { useState, useMemo } from "react";
import { Group } from "@visx/group";
import { Pie } from "@visx/shape";
import { motion } from "framer-motion";
import { RadioGroup, Radio } from "@headlessui/react";
import "./Expense.css";

// Data Types
interface ExpenseEntry {
  category: string;
  amount: number;
  color: string;
}

const expenseData7D: ExpenseEntry[] = [
  { category: "Food", amount: 120, color: "#6B7280" },
  { category: "Transport", amount: 80, color: "#A78BFA" },
  { category: "Shopping", amount: 60, color: "#FDE68A" },
  { category: "Health", amount: 40, color: "#FCA5A5" },
  { category: "Other", amount: 20, color: "#34D399" },
];

const expenseData30D: ExpenseEntry[] = [
  { category: "Food", amount: 450, color: "#6B7280" },
  { category: "Transport", amount: 300, color: "#A78BFA" },
  { category: "Shopping", amount: 200, color: "#FDE68A" },
  { category: "Health", amount: 120, color: "#FCA5A5" },
  { category: "Other", amount: 80, color: "#34D399" },
];

const width = 300;
const height = 180;
const margin = { top: 10, right: 10, bottom: 10, left: 10 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const radius = Math.min(innerWidth, innerHeight) / 2;
const centerY = innerHeight / 2;
const centerX = innerWidth / 2;

export default function Expense() {
  const [timeRange, setTimeRange] = useState<"7D" | "30D">("7D");
  const data = timeRange === "7D" ? expenseData7D : expenseData30D;

  const totalAmount = useMemo(
    () => data.reduce((acc, curr) => acc + curr.amount, 0),
    [data]
  );

  return (
    <div className="expense-card expense-card-modern">
      <div className="expense-header">
        <RadioGroup value={timeRange} onChange={setTimeRange} className="expense-toggle-pill">
            <div className="pill-container">
                <motion.div 
                className="pill-highlight"
                layoutId="active-pill"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                style={{
                    left: timeRange === "7D" ? "2px" : "50%",
                }}
                />
                <Radio value="7D" className="pill-option">
                {({ checked }) => (
                    <span className={`pill-label ${checked ? "active" : ""}`}>7D</span>
                )}
                </Radio>
                <Radio value="30D" className="pill-option">
                {({ checked }) => (
                    <span className={`pill-label ${checked ? "active" : ""}`}>30D</span>
                )}
                </Radio>
            </div>
         </RadioGroup>
      </div>

      <div className="expense-body">
        <svg width={width} height={height}>
          <Group top={centerY + margin.top} left={centerX + margin.left}>
            <Pie
              data={data}
              pieValue={(d) => d.amount}
              outerRadius={radius}
              innerRadius={radius * 0.65}
              padAngle={0.03}
              cornerRadius={4}
            >
              {(pie) => (
                <g>
                  {pie.arcs.map((arc) => {
                    const path = pie.path(arc) || "";
                    return (
                      <motion.path
                        key={arc.data.category}
                        d={path}
                        fill={arc.data.color}
                        initial={false}
                        animate={{ d: path }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        whileHover={{ scale: 1.05, opacity: 0.8 }}
                        style={{ cursor: "pointer" }}
                      />
                    );
                  })}
                </g>
              )}
            </Pie>
            
            {/* Center Label - Optional but recommended for donuts */}
            <text
              fill="#374151"
              textAnchor="middle"
              dy=".33em"
              fontSize={14}
              fontWeight={700}
            >
              ${totalAmount}
            </text>
          </Group>
        </svg>

        <div className="expense-legend">
          {data.map((d) => (
            <div key={d.category} className="expense-label">
              <span className="dot" style={{ backgroundColor: d.color }}></span>
              <span className="category-name">{d.category}</span>
              <span className="category-value">${d.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}