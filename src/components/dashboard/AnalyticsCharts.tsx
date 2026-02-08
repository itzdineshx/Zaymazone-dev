import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const salesData = [
  { month: "Jan", sales: 1200, orders: 24 },
  { month: "Feb", sales: 1580, orders: 31 },
  { month: "Mar", sales: 2100, orders: 42 },
  { month: "Apr", sales: 1890, orders: 38 },
  { month: "May", sales: 2400, orders: 48 },
  { month: "Jun", sales: 2847, orders: 57 }
];

const categoryData = [
  { name: "Pottery", value: 35, color: "hsl(var(--primary))" },
  { name: "Textiles", value: 28, color: "hsl(var(--secondary))" },
  { name: "Metal Crafts", value: 22, color: "hsl(var(--accent))" },
  { name: "Jewelry", value: 15, color: "hsl(var(--muted))" }
];

export function AnalyticsCharts() {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Sales Trend</CardTitle>
          <CardDescription>Monthly sales performance</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-muted-foreground" />
              <YAxis className="text-muted-foreground" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--background))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Orders by Month</CardTitle>
          <CardDescription>Number of orders received</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-muted-foreground" />
              <YAxis className="text-muted-foreground" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--background))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }} 
              />
              <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sales by Category</CardTitle>
          <CardDescription>Product category breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={false}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
          <CardDescription>Important performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Average Order Value</span>
              <span className="font-semibold">$127</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Conversion Rate</span>
              <span className="font-semibold">3.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Return Customer Rate</span>
              <span className="font-semibold">28%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Product Rating</span>
              <span className="font-semibold">4.8/5</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}