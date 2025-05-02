import React, { useMemo, useState } from "react";
import { useProducts } from "@/contexts/ProductContext";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart as BarChartComponent,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  BarChart,
  PieChart as PieChartIcon,
  ChartBar,
  DollarSign,
} from "lucide-react";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

const Analytics = () => {
  const { products, productHistory } = useProducts();
  const [activeTab, setActiveTab] = useState("overview");

  const totalValue = useMemo(() => {
    return products.reduce((sum, product) => {
      if (product.price && product.stock) {
        return sum + product.price * product.stock;
      }
      return sum;
    }, 0);
  }, [products]);

  const totalSales = useMemo(() => {
    return productHistory
      .filter(h => h.type === "sale" && h.price)
      .reduce((sum, h) => sum + (h.price || 0) * h.quantity, 0);
  }, [productHistory]);

  const totalPurchased = useMemo(() => {
    return productHistory
      .filter(h => h.type === "purchase")
      .reduce((sum, h) => sum + h.quantity, 0);
  }, [productHistory]);

  const totalSold = useMemo(() => {
    return productHistory
      .filter(h => h.type === "sale")
      .reduce((sum, h) => sum + h.quantity, 0);
  }, [productHistory]);

  const totalPurchaseCost = useMemo(() => {
    return productHistory
      .filter(h => h.type === "purchase" && h.price)
      .reduce((sum, h) => sum + (h.price || 0) * h.quantity, 0);
  }, [productHistory]);

  const categoryData = useMemo(() => {
    const categoryCounts: Record<string, number> = {};
    products.forEach(product => {
      if (categoryCounts[product.category]) {
        categoryCounts[product.category] += product.stock;
      } else {
        categoryCounts[product.category] = product.stock;
      }
    });
    return Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [products]);

  const monthlySalesData = useMemo(() => {
    const salesByMonth: Record<string, number> = {};
    productHistory
      .filter(h => h.type === "sale" && h.price)
      .forEach(sale => {
        const date = new Date(sale.date);
        const monthYear = `${date.toLocaleString("default", {
          month: "short",
        })} ${date.getFullYear()}`;
        salesByMonth[monthYear] =
          (salesByMonth[monthYear] || 0) + (sale.price || 0) * sale.quantity;
      });
    return Object.entries(salesByMonth).map(([month, amount]) => ({
      month,
      amount,
    }));
  }, [productHistory]);

  const monthlyPurchaseData = useMemo(() => {
    const purchasesByMonth: Record<string, number> = {};
    productHistory
      .filter(h => h.type === "purchase" && h.price)
      .forEach(purchase => {
        const date = new Date(purchase.date);
        const monthYear = `${date.toLocaleString("default", {
          month: "short",
        })} ${date.getFullYear()}`;
        purchasesByMonth[monthYear] =
          (purchasesByMonth[monthYear] || 0) + (purchase.price || 0) * purchase.quantity;
      });
    return Object.entries(purchasesByMonth).map(([month, amount]) => ({
      month,
      amount,
    }));
  }, [productHistory]);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Inventory Value
            </div>
            <div className="text-2xl font-bold mt-1 text-savvy-primary dark:text-savvy-accent">
              {formatCurrency(totalValue)}
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Sales
            </div>
            <div className="text-2xl font-bold mt-1 text-savvy-primary dark:text-savvy-accent">
              {formatCurrency(totalSales)}
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Items Purchased
            </div>
            <div className="text-2xl font-bold mt-1 text-savvy-primary dark:text-savvy-accent">
              {totalPurchased}
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Items Sold
            </div>
            <div className="text-2xl font-bold mt-1 text-savvy-primary dark:text-savvy-accent">
              {totalSold}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="dark:bg-gray-800 dark:border-gray-700">
          <TabsTrigger value="overview" className="data-[state=active]:dark:bg-gray-700">
            <BarChart className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="sales" className="data-[state=active]:dark:bg-gray-700">
            <ChartBar className="h-4 w-4 mr-2" />
            Sales
          </TabsTrigger>
          <TabsTrigger value="inventory" className="data-[state=active]:dark:bg-gray-700">
            <PieChartIcon className="h-4 w-4 mr-2" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="purchases" className="data-[state=active]:dark:bg-gray-700">
            <DollarSign className="h-4 w-4 mr-2" />
            Purchases
          </TabsTrigger>
        </TabsList>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <TabsContent value="overview" className="mt-0">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">
                Monthly Sales Overview
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChartComponent data={monthlySalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Bar dataKey="amount" fill="#4F46E5" />
                  </BarChartComponent>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="sales" className="mt-0">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Sales Analysis</h3>
              {monthlySalesData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChartComponent data={monthlySalesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Bar dataKey="amount" fill="#10B981" />
                    </BarChartComponent>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex justify-center items-center h-60 text-gray-500 dark:text-gray-400">
                  No sales data available
                </div>
              )}
            </TabsContent>

            <TabsContent value="inventory" className="mt-0">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">
                Inventory Distribution by Category
              </h3>
              {categoryData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        dataKey="value"
                      >
                        {categoryData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} items`, "Quantity"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex justify-center items-center h-60 text-gray-500 dark:text-gray-400">
                  No inventory data available
                </div>
              )}
            </TabsContent>

            <TabsContent value="purchases" className="mt-0">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">
                Monthly Purchase Overview
              </h3>
              {monthlyPurchaseData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChartComponent data={monthlyPurchaseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Bar dataKey="amount" fill="#F59E0B" />
                    </BarChartComponent>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex justify-center items-center h-60 text-gray-500 dark:text-gray-400">
                  No purchase data available
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default Analytics;
