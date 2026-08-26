"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ThemeCustomizationPage() {
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState({
    primaryColor: "#3b82f6",
    secondaryColor: "#10b981",
    accentColor: "#f59e0b",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    fontFamily: "Inter",
  });

  // Load current theme
  useEffect(() => {
    fetchTheme();
  }, []);

  const fetchTheme = async () => {
    try {
      const response = await fetch("/api/admin/theme");
      const data = await response.json();
      setTheme(data);
    } catch (error) {
      console.error("Error fetching theme:", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(theme),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Theme saved successfully. Refreshing...");
        // Reload page to apply new theme
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error(data.error || "Failed to save theme");
      }
    } catch (error) {
      toast.error("Failed to save theme");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset to default theme?")) return;

    setLoading(true);
    try {
      const response = await fetch("/api/admin/theme", {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setTheme(data.theme);
        toast.success("Theme reset to default. Refreshing...");
        // Reload page to apply default theme
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error(data.error || "Failed to reset theme");
      }
    } catch (error) {
      toast.error("Failed to reset theme");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 overflow-x-hidden">
      <div className="min-w-0">
        <h1 className="text-2xl md:text-3xl font-bold truncate">Theme Customization</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
          Customize your website colors and appearance
        </p>
      </div>

      <div className="grid gap-4 md:gap-6 md:grid-cols-2">
        {/* Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Color Settings</CardTitle>
            <CardDescription>
              Choose colors for your website theme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) =>
                    setTheme({ ...theme, primaryColor: e.target.value })
                  }
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={theme.primaryColor}
                  onChange={(e) =>
                    setTheme({ ...theme, primaryColor: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={theme.secondaryColor}
                  onChange={(e) =>
                    setTheme({ ...theme, secondaryColor: e.target.value })
                  }
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={theme.secondaryColor}
                  onChange={(e) =>
                    setTheme({ ...theme, secondaryColor: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accentColor">Accent Color</Label>
              <div className="flex gap-2">
                <Input
                  id="accentColor"
                  type="color"
                  value={theme.accentColor}
                  onChange={(e) =>
                    setTheme({ ...theme, accentColor: e.target.value })
                  }
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={theme.accentColor}
                  onChange={(e) =>
                    setTheme({ ...theme, accentColor: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={theme.backgroundColor}
                  onChange={(e) =>
                    setTheme({ ...theme, backgroundColor: e.target.value })
                  }
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={theme.backgroundColor}
                  onChange={(e) =>
                    setTheme({ ...theme, backgroundColor: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex gap-2">
                <Input
                  id="textColor"
                  type="color"
                  value={theme.textColor}
                  onChange={(e) =>
                    setTheme({ ...theme, textColor: e.target.value })
                  }
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={theme.textColor}
                  onChange={(e) =>
                    setTheme({ ...theme, textColor: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fontFamily">Font Family</Label>
              <Input
                id="fontFamily"
                type="text"
                value={theme.fontFamily}
                onChange={(e) =>
                  setTheme({ ...theme, fontFamily: e.target.value })
                }
                placeholder="Inter, Arial, sans-serif"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 pt-4">
              <Button onClick={handleSave} disabled={loading} className="flex-1 order-1">
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                onClick={handleReset}
                disabled={loading}
                variant="outline"
                className="order-2 sm:w-auto"
              >
                Reset to Default
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>See how your theme looks</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="p-6 rounded-lg space-y-4"
              style={{
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                fontFamily: theme.fontFamily,
              }}
            >
              <h2
                className="text-2xl font-bold"
                style={{ color: theme.primaryColor }}
              >
                Sample Heading
              </h2>
              <p>
                This is a sample paragraph to show how your text will look with
                the selected colors and font.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  className="px-4 py-2 rounded text-white text-sm"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  Primary Button
                </button>
                <button
                  className="px-4 py-2 rounded text-white text-sm"
                  style={{ backgroundColor: theme.secondaryColor }}
                >
                  Secondary Button
                </button>
                <button
                  className="px-4 py-2 rounded text-white text-sm"
                  style={{ backgroundColor: theme.accentColor }}
                >
                  Accent Button
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
