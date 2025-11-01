import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";

interface Analytics {
  id?: string;
  date: string;
  weight?: number;
  mood?: string;
  food_log?: string;
  sleep_hours?: number;
  notes?: string;
}

interface FoodLog {
  breakfast?: string;
  morning_snack?: string;
  lunch?: string;
  evening_snack?: string;
  dinner?: string;
}

const AnalyticsTracker = ({ userId }: { userId: string }) => {
  const [analytics, setAnalytics] = useState<Analytics>({
    date: format(new Date(), "yyyy-MM-dd"),
  });
  const [foodLog, setFoodLog] = useState<FoodLog>({});
  const [history, setHistory] = useState<Analytics[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, [userId]);

  const fetchAnalytics = async () => {
    const { data } = await supabase
      .from("user_analytics")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(7);

    if (data) setHistory(data);

    // Load today's data if exists
    const today = format(new Date(), "yyyy-MM-dd");
    const todayData = data?.find((item) => item.date === today);
    if (todayData) {
      setAnalytics(todayData);
      if (todayData.food_log) {
        try {
          setFoodLog(JSON.parse(todayData.food_log));
        } catch {
          setFoodLog({});
        }
      }
    }
  };

  const handleSave = async () => {
    const { error } = await supabase.from("user_analytics").upsert({
      user_id: userId,
      date: analytics.date,
      weight: analytics.weight,
      mood: analytics.mood,
      food_log: JSON.stringify(foodLog),
      sleep_hours: analytics.sleep_hours,
      notes: analytics.notes,
    });

    if (error) {
      toast.error("Failed to save analytics");
    } else {
      toast.success("Analytics saved successfully");
      fetchAnalytics();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Daily Analytics Tracker</CardTitle>
          <CardDescription>Track your weight, mood, food, and sleep</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={analytics.date}
                onChange={(e) => setAnalytics({ ...analytics, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="e.g., 70.5"
                value={analytics.weight || ""}
                onChange={(e) => setAnalytics({ ...analytics, weight: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mood">Mood</Label>
              <Input
                id="mood"
                type="text"
                placeholder="e.g., Happy, Energetic"
                value={analytics.mood || ""}
                onChange={(e) => setAnalytics({ ...analytics, mood: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sleep">Sleep Hours</Label>
              <Input
                id="sleep"
                type="number"
                step="0.5"
                placeholder="e.g., 7.5"
                value={analytics.sleep_hours || ""}
                onChange={(e) => setAnalytics({ ...analytics, sleep_hours: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Food Log</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="breakfast">Breakfast</Label>
                <Textarea
                  id="breakfast"
                  placeholder="What did you eat for breakfast?"
                  value={foodLog.breakfast || ""}
                  onChange={(e) => setFoodLog({ ...foodLog, breakfast: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="morning_snack">Morning Snack</Label>
                <Textarea
                  id="morning_snack"
                  placeholder="Morning snacks..."
                  value={foodLog.morning_snack || ""}
                  onChange={(e) => setFoodLog({ ...foodLog, morning_snack: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lunch">Lunch</Label>
                <Textarea
                  id="lunch"
                  placeholder="What did you eat for lunch?"
                  value={foodLog.lunch || ""}
                  onChange={(e) => setFoodLog({ ...foodLog, lunch: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evening_snack">Evening Snack</Label>
                <Textarea
                  id="evening_snack"
                  placeholder="Evening snacks..."
                  value={foodLog.evening_snack || ""}
                  onChange={(e) => setFoodLog({ ...foodLog, evening_snack: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="dinner">Dinner</Label>
                <Textarea
                  id="dinner"
                  placeholder="What did you eat for dinner?"
                  value={foodLog.dinner || ""}
                  onChange={(e) => setFoodLog({ ...foodLog, dinner: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes..."
              value={analytics.notes || ""}
              onChange={(e) => setAnalytics({ ...analytics, notes: e.target.value })}
              rows={3}
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Today's Data
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent History</CardTitle>
          <CardDescription>Your last 7 days of tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="border-b pb-4 last:border-0">
                <p className="font-semibold">{format(new Date(item.date), "MMM dd, yyyy")}</p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
                  {item.weight && <p>Weight: {item.weight} kg</p>}
                  {item.sleep_hours && <p>Sleep: {item.sleep_hours} hrs</p>}
                  {item.mood && <p>Mood: {item.mood}</p>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTracker;