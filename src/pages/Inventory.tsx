
import React, { useState } from "react";
import { useProducts } from "@/contexts/ProductContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, ShoppingCart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SellProductForm from "@/components/products/SellProductForm";

const Inventory = () => {
  const { products } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProductForSale, setSelectedProductForSale] = useState<string | null>(null);

  // Calculate inventory stats
  const totalProducts = products.length;
  const totalInStock = products.filter((p) => p.status === "In Stock").length;
  const lowStockCount = products.filter(
    (p) => p.status === "In Stock" && p.stock <= 2
  ).length;

  // Get unique categories
  const categories = Array.from(new Set(products.map((p) => p.category)));

  // Filter products by category
  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === null || product.category === selectedCategory)
  );

  // Find the selected product for sale
  const productForSale = products.find(p => p.id === selectedProductForSale);

  const handleSale = (productId: string) => {
    setSelectedProductForSale(productId);
  };

  const closeSaleDialog = () => {
    setSelectedProductForSale(null);
  };

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
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
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
                        <div className="flex items-center">
                          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-md flex items-center">
                            <DollarSign className="h-3.5 w-3.5 mr-1" />
                            {product.price ? product.price.toFixed(2) : '0.00'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.status === "Sold" && product.stock === 0 ? (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Sold Out</Badge>
                        ) : product.status === "Sold" && product.stock > 0 ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Partially Sold</Badge>
                        ) : product.stock <= 2 ? (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Low Stock</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">In Stock</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {product.stock > 0 && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleSale(product.id)}
                            className="bg-savvy-primary text-white hover:bg-savvy-primary/90"
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Sell
                          </Button>
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

      {/* Sell Product Dialog */}
      <Dialog open={!!selectedProductForSale} onOpenChange={(open) => !open && closeSaleDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Product as Sold</DialogTitle>
          </DialogHeader>
          {productForSale && (
            <SellProductForm 
              product={productForSale} 
              onComplete={closeSaleDialog} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
