import React, { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";

const Dashboard = ({ tasks }) => {
    const columnData = useMemo(() => {
        const counts = {
            TODO: 0,
            INPROGRESS: 0,
            DONE: 0,
        };
        tasks.forEach((task) => {
            counts[task.status]++;
        });
        return [
            { name: "To Do", count: counts.TODO, fill: "#6366f1" },
            { name: "In Progress", count: counts.INPROGRESS, fill: "#f59e0b" },
            { name: "Done", count: counts.DONE, fill: "#10b981" },
        ];
    }, [tasks]);

    const completionData = useMemo(() => {
        const done = tasks.filter((t) => t.status === "DONE").length;
        const total = tasks.length;
        if (total === 0) return [{ name: "Pending", value: 100 }];

        return [
            { name: "Completed", value: Math.round((done / total) * 100) },
            { name: "Remaining", value: Math.round(((total - done) / total) * 100) },
        ];
    }, [tasks]);

    const COLORS = ["#10b981", "#334155"];

    return (
        <div className="charts-container">
            <div className="chart-box" data-testid="chart-column-count">
                <h3 className="mb-4 text-secondary text-sm font-semibold uppercase">Tasks per Column</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={columnData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc' }}
                            itemStyle={{ color: '#f8fafc' }}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="chart-box" data-testid="chart-completion">
                <h3 className="mb-4 text-secondary text-sm font-semibold uppercase">Completion Percentage</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={completionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {completionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc' }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;
