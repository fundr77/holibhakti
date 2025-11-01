import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download } from "lucide-react";
import { format } from "date-fns";
import * as XLSX from "xlsx";

interface Analytics {
  id: string;
  date: string;
  weight?: number;
  mood?: string;
  food_log?: string;
  sleep_hours?: number;
  notes?: string;
}

interface UserAnalyticsReportProps {
  userId: string;
  userName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserAnalyticsReport = ({ userId, userName, open, onOpenChange }: UserAnalyticsReportProps) => {
  const [analytics, setAnalytics] = useState<Analytics[]>([]);

  useEffect(() => {
    if (open && userId) {
      fetchAnalytics();
    }
  }, [open, userId]);

  const fetchAnalytics = async () => {
    const { data } = await supabase
      .from("user_analytics")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: true });

    if (data) setAnalytics(data);
  };

  const getMoodLabel = (mood?: string) => {
    const moodMap: { [key: string]: string } = {
      bad: "😔 Bad",
      okay: "😐 Okay",
      good: "🙂 Good",
      excellent: "😄 Excellent"
    };
    return mood ? moodMap[mood] || mood : "-";
  };

  const parseFoodLog = (foodLog?: string) => {
    if (!foodLog) return {};
    try {
      return JSON.parse(foodLog);
    } catch {
      return { general: foodLog };
    }
  };

  const exportToExcel = () => {
    const exportData = analytics.map((item) => {
      const foodLog = parseFoodLog(item.food_log);
      return {
        Date: format(new Date(item.date), "MMM dd, yyyy"),
        Weight: item.weight || "-",
        Mood: getMoodLabel(item.mood),
        "Sleep Hours": item.sleep_hours || "-",
        Breakfast: foodLog.breakfast || "-",
        "Morning Snack": foodLog.morning_snack || "-",
        Lunch: foodLog.lunch || "-",
        "Evening Snack": foodLog.evening_snack || "-",
        Dinner: foodLog.dinner || "-",
        Notes: item.notes || "-"
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Analytics");
    XLSX.writeFile(wb, `${userName}_analytics_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  };

  const weightData = analytics
    .filter((item) => item.weight)
    .map((item) => ({
      date: format(new Date(item.date), "MMM dd"),
      weight: item.weight
    }));

  const sleepData = analytics
    .filter((item) => item.sleep_hours)
    .map((item) => ({
      date: format(new Date(item.date), "MMM dd"),
      hours: item.sleep_hours
    }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Analytics Report - {userName}</DialogTitle>
            <Button onClick={exportToExcel} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export to Excel
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Weight Chart */}
          {weightData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Weight Tracking</CardTitle>
                <CardDescription>Weight measurements over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" name="Weight (kg)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Sleep Chart */}
          {sleepData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Sleep Tracking</CardTitle>
                <CardDescription>Sleep hours over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sleepData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="hours" stroke="hsl(var(--chart-2))" name="Sleep Hours" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Daily Log */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Logs</CardTitle>
              <CardDescription>Complete history of daily entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.map((item) => {
                  const foodLog = parseFoodLog(item.food_log);
                  return (
                    <div key={item.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-lg">{format(new Date(item.date), "MMM dd, yyyy")}</p>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          {item.weight && <span>Weight: {item.weight} kg</span>}
                          {item.sleep_hours && <span>Sleep: {item.sleep_hours} hrs</span>}
                        </div>
                      </div>

                      {item.mood && (
                        <div className="text-sm">
                          <span className="font-medium">Mood: </span>
                          <span>{getMoodLabel(item.mood)}</span>
                        </div>
                      )}

                      {Object.keys(foodLog).length > 0 && (
                        <div className="text-sm space-y-1">
                          <p className="font-medium">Food Log:</p>
                          <div className="grid grid-cols-2 gap-2 pl-4">
                            {foodLog.breakfast && <p><span className="font-medium">Breakfast:</span> {foodLog.breakfast}</p>}
                            {foodLog.morning_snack && <p><span className="font-medium">Morning Snack:</span> {foodLog.morning_snack}</p>}
                            {foodLog.lunch && <p><span className="font-medium">Lunch:</span> {foodLog.lunch}</p>}
                            {foodLog.evening_snack && <p><span className="font-medium">Evening Snack:</span> {foodLog.evening_snack}</p>}
                            {foodLog.dinner && <p><span className="font-medium">Dinner:</span> {foodLog.dinner}</p>}
                            {foodLog.general && <p><span className="font-medium">General:</span> {foodLog.general}</p>}
                          </div>
                        </div>
                      )}

                      {item.notes && (
                        <div className="text-sm">
                          <span className="font-medium">Notes: </span>
                          <span className="text-muted-foreground">{item.notes}</span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {analytics.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No analytics data available for this user.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserAnalyticsReport;
