import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Store, Calendar, Check } from "lucide-react";
import { UserRole } from "@/types/marketplace";
import { cn } from "@/lib/utils";

interface RoleSelectorProps {
  selectedRole?: UserRole;
  onRoleSelect: (role: UserRole) => void;
}

export const RoleSelector = ({
  selectedRole,
  onRoleSelect,
}: RoleSelectorProps) => {
  const roles = [
    {
      value: "customer" as UserRole,
      title: "Customer",
      description: "Browse and buy products, book services",
      icon: ShoppingCart,
      features: [
        "Shop marketplace",
        "Book services",
        "Chat with sellers",
        "Leave reviews",
      ],
    },
    {
      value: "retailer" as UserRole,
      title: "Retailer",
      description: "Sell physical products online",
      icon: Store,
      features: [
        "List products",
        "Manage inventory",
        "Track orders",
        "Promote listings",
      ],
    },
    {
      value: "service-provider" as UserRole,
      title: "Service Provider",
      description: "Offer services with booking system",
      icon: Calendar,
      features: [
        "List services",
        "Manage bookings",
        "Set availability",
        "Build reputation",
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Choose Your Account Type</h3>
        <p className="text-sm text-muted-foreground">
          Select how you plan to use Westgate Marketplace
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.value;

          return (
            <Card
              key={role.value}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                isSelected && "ring-2 ring-primary border-primary",
              )}
              onClick={() => onRoleSelect(role.value)}
            >
              <CardHeader className="text-center pb-3">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="flex items-center justify-center gap-2">
                  {role.title}
                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                </CardTitle>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {role.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
