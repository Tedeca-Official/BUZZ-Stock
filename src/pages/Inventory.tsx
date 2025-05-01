
import React, { useState } from "react";
import { useProducts } from "@/contexts/ProductContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Inventory = () => {
  const { products } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Calculate inventory stats
  const totalProducts = products.length;
  const totalInStock = products.filter((p) => p.status === "In Stock").length;
  const lowStockCount = products.filter(
    (p) => p.status === "In Stock" && p.stock <= 2
  ).length;

  // Get unique categories
  const categories = Array.from(new Set(products.map((p) => p.category)));

  // Filter products by category and only show in-stock items
  const filteredProducts = products.filter(
    (product) =>
      product.status === "In Stock" && 
      (selectedCategory === null || product.category === selectedCategory)
  );

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500">Total Products</p>
            <p className="text-2xl font-semibold">{totalProducts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500">In Stock</p>
            <p className="text-2xl font-semibold">{totalInStock}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500">Low Stock</p>
            <p className="text-2xl font-semibold text-yellow-600">{lowStockCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center">
            <div>
              <CardTitle>Current Inventory</CardTitle>
              <CardDescription>
                View and manage your product inventory
              </CardDescription>
            </div>
            <div className="mt-2 sm:mt-0 sm:ml-4 w-full sm:w-40">
              <Select 
                value={selectedCategory || "all-categories"} 
                onValueChange={(value) => setSelectedCategory(value === "all-categories" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-categories">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No products in inventory.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.productId}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        {product.stock <= 2 ? (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Low Stock</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">In Stock</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
