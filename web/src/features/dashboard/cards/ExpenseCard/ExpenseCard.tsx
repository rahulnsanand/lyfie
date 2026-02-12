import React, { useState, useMemo } from "react";
import { Group } from "@visx/group";
import { Pie } from "@visx/shape";
import { motion } from "framer-motion";
import { interpolate } from "d3-interpolate";
import * as RadioGroup from "@radix-ui/react-radio-group";
import "./ExpenseCard.css";

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
  { category: "Shopping", amount: 2000, color: "#FDE68A" },
  { category: "Health", amount: 120, color: "#FCA5A5" },
  { category: "Other", amount: 80, color: "#34D399" },
];

const width = 300;
const height = 180;
const margin = { top: 0, right: 0, bottom: 0, left: 0 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const radius = Math.min(innerWidth, innerHeight) / 2;
const centerY = innerHeight / 2;
const centerX = innerWidth / 2;
const currencyUnit = "Rs."

// 1. Create a sub-component to handle the smooth morphing
const AnimatedPath = ({ arc, pathGenerator }: { arc: any, pathGenerator: any }) => {
  const [d, setD] = React.useState(pathGenerator(arc));
  const previousArc = React.useRef(arc);

  React.useEffect(() => {
    // This creates a smooth interpolator between the old arc and new arc
    const interpolator = interpolate(previousArc.current, arc);
    
    let frameId: number;
    const duration = 600; // ms
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      
      // Calculate the "in-between" arc and generate the path string
      setD(pathGenerator(interpolator(t)));

      if (t < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        previousArc.current = arc;
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [arc, pathGenerator]);

  return (
    <motion.path
      d={d}
      fill={arc.data.color}
      whileHover={{ scale: 1.05, opacity: 0.9 }}
      transition={{ type: "spring", stiffness: 300 }}
      style={{ cursor: "pointer", originX: "0px", originY: "0px" }}
    />
  );
};

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
        <RadioGroup.Root
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as "7D" | "30D")}
          className="expense-toggle-pill"
        >
            <div className="pill-container">
                <motion.div 
                className="pill-highlight"
                layoutId="active-pill"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                style={{
                    left: timeRange === "7D" ? "2px" : "50%",
                }}
                />
                <RadioGroup.Item value="7D" className="pill-option" aria-label="Last 7 days">
                  <span className="pill-label">7D</span>
                </RadioGroup.Item>
                <RadioGroup.Item value="30D" className="pill-option" aria-label="Last 30 days">
                  <span className="pill-label">30D</span>
                </RadioGroup.Item>
            </div>
         </RadioGroup.Root>
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
                    {pie.arcs.map((arc) => (
                    <AnimatedPath 
                        key={arc.data.category} 
                        arc={arc} 
                        pathGenerator={pie.path} 
                    />
                    ))}
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
              {currencyUnit}{totalAmount}
            </text>
          </Group>
        </svg>

        <div className="expense-legend">
          {data.map((d) => (
            <div key={d.category} className="expense-label">
              <span className="dot" style={{ backgroundColor: d.color }}></span>
              <span className="category-name">{d.category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}