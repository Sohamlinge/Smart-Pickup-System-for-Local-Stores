import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis,
  ResponsiveContainer, AreaChart, Area
} from "recharts";
import axios from "axios";
const API_BASE = "http://localhost:8080/admin";

const COLORS = ["#0088FE", "#00C49F"];

const cardStyle = {
  borderRadius: "12px",
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
  padding: "1.5rem",
  backgroundColor: "#fff",
  minHeight: "350px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "1.5rem",
  fontWeight: 600,
  fontSize: "1.25rem",
  color: "#343a40",
  userSelect: "none",
};

const titleStyle1 = {
  textAlign: "center",
  marginBottom: "3rem",
  fontWeight: "700",
  fontSize: "2rem",
};
const tooltipStyle = {
  contentStyle: {
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "0.9rem",
  },
  labelStyle: { fontWeight: "700", color: "#333" },
};

const ReportCharts = () => {
  const [stats, setStats] = useState({ users: 0, shopkeepers: 0 });
  const [orders, setOrders] = useState([]);
  const [cityData, setCityData] = useState([]);


  useEffect(() => {
    axios.get(`${API_BASE}/stats/counts`)
      .then(res => {
        // Defensive data extraction for various backend casing
        let data = res.data;
        if ("Users" in data && "Shopkeepers" in data) {
          setStats({
            users: data.Users,
            shopkeepers: data.Shopkeepers,
          });
        } else if ("users" in data && "shopkeepers" in data) {
          setStats({
            users: data.users,
            shopkeepers: data.shopkeepers,
          });
        } else {
          setStats({ users: 0, shopkeepers: 0 }); // fallback
        }
      })
      .catch(err => {
        setStats({ users: 0, shopkeepers: 0 });
        console.error("Error fetching stats:", err);
      });

    axios.get(`${API_BASE}/orders/daily`)
      .then(res => {
        // Defensive extraction
        let data = Array.isArray(res.data)
          ? res.data
          : res.data?.$values || [];
        setOrders(data);
      })
      .catch(err => {
        setOrders([]);
        console.error("Error fetching orders:", err);
      });

    axios.get(`${API_BASE}/stats/city-distribution`)
      .then(res => {
        let data = Array.isArray(res.data)
          ? res.data
          : res.data?.$values || [];
        setCityData(data);
      })
      .catch(err => {
        setCityData([]);
        console.error("Error fetching city distribution:", err);
      });
  }, []);

  const pieData = [
    { name: "Users", value: stats.users },
    { name: "Shopkeepers", value: stats.shopkeepers },
  ];

  return (
    <div className="p-4" style={{ maxWidth: "1100px", margin: "auto" }}>
      <h2 style={titleStyle1}>📊 Reports and Charts</h2>
      <Row className="g-4 mb-4">
        {/* Users vs Shopkeepers Pie */}
        <Col xs={12} md={6}>
          <Card style={cardStyle}>
            <h6 style={titleStyle}>Users vs Shopkeepers</h6>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  label={{ fill: "#212529", fontWeight: 600 }}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle.contentStyle}
                  labelStyle={tooltipStyle.labelStyle}
                  formatter={(value) => value.toLocaleString()}
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconSize={14}
                  formatter={(value) => <span style={{ color: "#495057", fontWeight: 600 }}>{value}</span>}
                  wrapperStyle={{ paddingTop: "0.75rem" }}
                />
              </PieChart>
            </ResponsiveContainer>
            {(stats.users === 0 && stats.shopkeepers === 0) && (
              <div className="text-center text-muted mt-3">No data available.</div>
            )}
          </Card>
        </Col>

        {/* Daily Orders Bar Chart */}
        <Col xs={12} md={6}>
          <Card style={cardStyle}>
            <h6 style={titleStyle}>Daily Orders</h6>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={orders} margin={{ top: 15, bottom: 10 }}>
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#495057" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#495057" }} />
                <Tooltip
                  contentStyle={tooltipStyle.contentStyle}
                  labelStyle={tooltipStyle.labelStyle}
                  formatter={(value) => value.toLocaleString()}
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconSize={14}
                  formatter={(value) => <span style={{ color: "#495057", fontWeight: 600 }}>{value}</span>}
                  wrapperStyle={{ paddingTop: "0.75rem" }}
                />
                <Bar dataKey="count" fill="#82ca9d" name="Orders" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            {orders.length === 0 && (
              <div className="text-center text-muted mt-3">No orders data available.</div>
            )}
          </Card>
        </Col>

        {/* City-wise Users & Shopkeepers Area Chart */}
        <Col xs={12}>
          <Card style={{ ...cardStyle, minHeight: 400 }}>
            <h6 style={titleStyle}>City-wise Users & Shopkeepers (AreaChart)</h6>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={cityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorShopkeepers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="city" tick={{ fontSize: 12, fill: "#495057" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#495057" }} />
                <Tooltip
                  contentStyle={tooltipStyle.contentStyle}
                  labelStyle={tooltipStyle.labelStyle}
                  formatter={(value) => value.toLocaleString()}
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconSize={14}
                  formatter={(value) => <span style={{ color: "#495057", fontWeight: 600 }}>{value}</span>}
                  wrapperStyle={{ paddingTop: "0.75rem" }}
                />
                <Area
                  type="monotone"
                  dataKey="userCount"
                  stroke="#8884d8"
                  fill="url(#colorUsers)"
                  name="Users"
                  activeDot={{ r: 6 }}
                />
                <Area
                  type="monotone"
                  dataKey="shopkeeperCount"
                  stroke="#82ca9d"
                  fill="url(#colorShopkeepers)"
                  name="Shopkeepers"
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
            {cityData.length === 0 && (
              <div className="text-center text-muted mt-3">No city distribution data available.</div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ReportCharts;
