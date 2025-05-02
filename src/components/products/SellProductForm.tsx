
import React, { useState } from "react";
import { useProducts, Product } from "@/contexts/ProductContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface SellProductFormProps {
  product: Product;
  onComplete: () => void;
}

// Create a schema for form validation
const SaleFormSchema = z.object({
  quantity: z.string()
    .refine((val) => !isNaN(parseInt(val)), {
      message: "Quantity must be a number",
    })
    .refine((val) => parseInt(val) > 0, {
      message: "Quantity must be greater than zero",
    }),
  saleDate: z.string().min(1, "Sale date is required"),
  salePrice: z.string()
    .refine((val) => !isNaN(parseFloat(val)), {
      message: "Sale price must be a number",
    })
    .refine((val) => parseFloat(val) > 0, {
      message: "Sale price must be greater than zero",
    }),
});

const SellProductForm: React.FC<SellProductFormProps> = ({
  product,
  onComplete,
}) => {
  const { markAsSold } = useProducts();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize the form with default values
  const form = useForm<z.infer<typeof SaleFormSchema>>({
    resolver: zodResolver(SaleFormSchema),
    defaultValues: {
      quantity: "1",
      saleDate: new Date().toISOString().split("T")[0],
      salePrice: product.price ? product.price.toString() : "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof SaleFormSchema>) => {
    const quantityValue = parseInt(values.quantity, 10);
    const salePriceValue = parseFloat(values.salePrice);
    
    // Additional validation for quantity vs stock
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
      await markAsSold(product.id, values.saleDate, quantityValue, salePriceValue);

      toast({
        title: "Product Sold",
        description: `${quantityValue} units of ${product.name} marked as sold for $${salePriceValue.toFixed(2)}.`,
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">
                Quantity to Sell <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max={product.stock}
                  {...field}
                  className="rounded-lg"
                />
              </FormControl>
              <p className="text-xs text-gray-500 mt-1">
                {product.stock} units available
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="saleDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">
                Sale Date <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  {...field}
                  className="rounded-lg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="salePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">
                Sale Price <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Enter sale price"
                  {...field}
                  className="rounded-lg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
    </Form>
  );
};

export default SellProductForm;
