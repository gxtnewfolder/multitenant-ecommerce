"use client";

import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { PriceFilter } from "./price-filter";
import { useProductFilters } from "@/modules/products/hooks/use-product-filters";
import { TagsFilter } from "./tags-filter";

interface ProductFiltersProps {
    title: string;
    className?: string;
    children: React.ReactNode;
}
const ProductFilter = ({ title, className, children }: ProductFiltersProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;

    return (
        <div className={cn(
            "p-4 border-b flex flex-col gap-2",
            className
        )}>
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsOpen((current) => !current)}
            >
                <p className="font-medium">{title}</p>
                <Icon className="size-5" />
            </div>
            {isOpen && children}
        </div>
    )
}

export const ProductFilters = () => {
    const [filters, setFilters] = useProductFilters();

    const hasAnyFilters = Object.entries(filters).some(([key, value]) => {
        if (key === "sort") return false;

        if (Array.isArray(value)) {
            return value.length > 0;
        }

        if (typeof value === "string") {
            return value !== "";
        }
        return value !== null;
    });

    const onChange = (key: keyof typeof filters, value: unknown) => {
        setFilters({ ...filters, [key]: value });
    }

    const onClear = () => {
        setFilters({
            minPrice: "",
            maxPrice: "",
            tags: [],
        });
    }

    return (
        <div className="border rounded-md bg-white">
            <div className="p-4 border-b flex justify-between items-center">
                <p className="font-medium">Filters</p>
                {hasAnyFilters && (
                    <button className="underline cursor-pointer" onClick={onClear} type="button">
                        Clear
                    </button>
                )}
            </div>
            <ProductFilter title="Price">
                <PriceFilter
                    minPrice={filters.minPrice}
                    maxPrice={filters.maxPrice}
                    onMinPriceChange={(value) => onChange("minPrice", value)}
                    onMaxPriceChange={(value) => onChange("maxPrice", value)}
                />
            </ProductFilter>
            <ProductFilter title="Tags" className="border-b-0">
                <TagsFilter
                    value={filters.tags}
                    onChange={(value) => onChange("tags", value)}
                />
            </ProductFilter>
        </div>
    )
}