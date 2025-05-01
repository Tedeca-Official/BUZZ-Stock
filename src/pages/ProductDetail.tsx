
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts, Product, ProductHistory } from "@/contexts/ProductContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, ShoppingBag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditProductForm from "@/components/products/EditProductForm";
import SellProductForm from "@/components/products/SellProductForm";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, getHistoryForProduct } = useProducts();
  const { isAdmin } = useAuth();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);

  const product = getProductById(id || "");
  const productHistory = getHistoryForProduct(id || "");

  if (!product) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
        <p className="mt-2 text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
        <Button 
          onClick={() => navigate("/products")}
          variant="outline"
          className="mt-4"
        >
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/products")}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{product.name}</h1>
        </div>
        <div className="flex space-x-2 mt-2 sm:mt-0">
          {product.status === "In Stock" && (
            <Button 
              onClick={() => setIsSellDialogOpen(true)} 
              variant="outline"
              className="flex items-center"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Sell Product
            </Button>
          )}
          {isAdmin && (
            <Button 
              onClick={() => setIsEditDialogOpen(true)} 
              className="bg-savvy-primary"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <InfoCard 
          title="Status" 
          value={
            <ProductStatusBadge status={product.status} stock={product.stock} />
          } 
        />
        <InfoCard 
          title="Stock" 
          value={`${product.stock} units`} 
        />
        <InfoCard 
          title="Price" 
          value={product.price ? `$${product.price.toFixed(2)}` : "N/A"} 
        />
      </div>

      <Tabs defaultValue="details">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>Comprehensive information about this product</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <DetailItem label="Product ID" value={product.productId} />
                <DetailItem label="Category" value={product.category} />
                <DetailItem label="Purchase Date" value={formatDate(product.purchaseDate)} />
                {product.status === "Sold" && product.saleDate && (
                  <DetailItem label="Sale Date" value={formatDate(product.saleDate)} />
                )}
                {product.status === "Sold" && product.saleQuantity && (
                  <DetailItem label="Quantity Sold" value={product.saleQuantity.toString()} />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Product History</CardTitle>
              <CardDescription>Transaction history for this product</CardDescription>
            </CardHeader>
            <CardContent>
              {productHistory.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No history available for this product.</p>
              ) : (
                <div className="space-y-4">
                  {productHistory.map((entry) => (
                    <HistoryEntry key={entry.id} entry={entry} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the details for {product.name}
            </DialogDescription>
          </DialogHeader>
          <EditProductForm 
            product={product} 
            onComplete={() => setIsEditDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Sell Product Dialog */}
      <Dialog open={isSellDialogOpen} onOpenChange={setIsSellDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Sell Product</DialogTitle>
            <DialogDescription>
              Mark {product.name} as sold or update quantity
            </DialogDescription>
          </DialogHeader>
          <SellProductForm 
            product={product} 
            onComplete={() => setIsSellDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface InfoCardProps {
  title: string;
  value: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, value }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="mt-1 text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
};

interface DetailItemProps {
  label: string;
  value: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => {
  return (
    <div className="py-2">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1">{value}</p>
    </div>
  );
};

interface HistoryEntryProps {
  entry: ProductHistory;
}

const HistoryEntry: React.FC<HistoryEntryProps> = ({ entry }) => {
  const isPositive = entry.type === "purchase";
  return (
    <div className="flex items-center justify-between p-4 bg-white border rounded-lg">
      <div>
        <p className="text-sm font-medium">
          {entry.type === "purchase" ? "Purchase" : "Sale"}
        </p>
        <p className="text-xs text-gray-500">{formatDate(entry.date)}</p>
      </div>
      <div className="text-right">
        <p className={`font-medium ${isPositive ? "text-green-600" : "text-blue-600"}`}>
          {isPositive ? "+" : "-"}{entry.quantity} units
        </p>
        {entry.price && (
          <p className="text-xs text-gray-500">
            ${entry.price.toFixed(2)} per unit
          </p>
        )}
      </div>
    </div>
  );
};

interface ProductStatusBadgeProps {
  status: string;
  stock: number;
}

const ProductStatusBadge: React.FC<ProductStatusBadgeProps> = ({ status, stock }) => {
  if (status === "Sold") {
    return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Sold</Badge>;
  }
  
  if (stock <= 2) {
    return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Low Stock</Badge>;
  }
  
  return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">In Stock</Badge>;
};

// Helper function to format dates
function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export default ProductDetail;
