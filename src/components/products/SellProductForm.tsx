
import React, { useState } from "react";
import { useProducts, Product } from "@/contexts/ProductContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface SellProductFormProps {
  product: Product;
  onComplete: () => void;
}

const SellProductForm: React.FC<SellProductFormProps> = ({
  product,
  onComplete,
}) => {
  const { markAsSold } = useProducts();
  const { toast } = useToast();

  const [quantity, setQuantity] = useState("1");
  const [saleDate, setSaleDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!saleDate || !quantity) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const quantityValue = parseInt(quantity, 10);
    if (quantityValue <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Quantity must be greater than zero.",
        variant: "destructive",
      });
      return;
    }

    if (quantityValue > product.stock) {
      toast({
        title: "Not Enough Stock",
        description: `Only ${product.stock} units available.`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await markAsSold(product.id, saleDate, quantityValue);

      toast({
        title: "Product Sold",
        description: `${quantityValue} units of ${product.name} marked as sold.`,
      });

      onComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity to Sell *</Label>
        <Input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="1"
          max={product.stock}
          required
          className="rounded-lg"
        />
        <p className="text-xs text-gray-500 mt-1">
          {product.stock} units available
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="saleDate">Sale Date *</Label>
        <Input
          id="saleDate"
          type="date"
          value={saleDate}
          onChange={(e) => setSaleDate(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
          required
          className="rounded-lg"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onComplete}
          disabled={isSubmitting}
          className="rounded-full"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="bg-savvy-primary rounded-full"
        >
          {isSubmitting ? "Processing..." : "Complete Sale"}
        </Button>
      </div>
    </form>
  );
};

export default SellProductForm;
