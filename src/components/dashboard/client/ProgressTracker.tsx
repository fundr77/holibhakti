import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Analytics {
  date: string;
  weight: number | null;
  mood: string | null;
  sleep_hours: number | null;
}

const ProgressTracker = ({ userId }: { userId: string }) => {
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [stats, setStats] = useState({
    weightChange: 0,
    avgSleep: 0,
    avgMoodScore: 0
  });

  useEffect(() => {
    fetchAnalytics();
  }, [userId]);

  const fetchAnalytics = async () => {
    const { data } = await supabase
      .from("user_analytics")
      .select("date, weight, mood, sleep_hours")
      .eq("user_id", userId)
      .order("date", { ascending: true })
      .limit(30);

    if (data) {
      setAnalytics(data);
      calculateStats(data);
    }
  };

  const calculateStats = (data: Analytics[]) => {
    if (data.length === 0) return;

    const weights = data.filter(d => d.weight).map(d => d.weight!);
    const weightChange = weights.length > 1 ? weights[weights.length - 1] - weights[0] : 0;

    const sleeps = data.filter(d => d.sleep_hours).map(d => d.sleep_hours!);
    const avgSleep = sleeps.length > 0 ? sleeps.reduce((a, b) => a + b, 0) / sleeps.length : 0;

    const moodScores = data.filter(d => d.mood).map(d => {
      const mood = d.mood!.toLowerCase();
      if (mood.includes('great') || mood.includes('excellent')) return 5;
      if (mood.includes('good') || mood.includes('happy')) return 4;
      if (mood.includes('okay') || mood.includes('neutral')) return 3;
      if (mood.includes('bad') || mood.includes('sad')) return 2;
      return 1;
    });
    const avgMoodScore = moodScores.length > 0 
      ? moodScores.reduce((a, b) => a + b, 0) / moodScores.length 
      : 0;

    setStats({ weightChange, avgSleep, avgMoodScore });
  };

  const chartData = analytics.map(a => ({
    date: new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: a.weight,
    sleep: a.sleep_hours
  }));

  const TrendIcon = ({ value }: { value: number }) => {
    if (value > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (value < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Weight Change</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              {stats.weightChange > 0 ? '+' : ''}{stats.weightChange.toFixed(1)} kg
              <TrendIcon value={stats.weightChange} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Average Sleep</CardDescription>
            <CardTitle className="text-3xl">
              {stats.avgSleep.toFixed(1)} hrs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Per night</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Mood Score</CardDescription>
            <CardTitle className="text-3xl">
              {stats.avgMoodScore.toFixed(1)}/5
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Average rating</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progress Charts</CardTitle>
          <CardDescription>Your health metrics over time</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="weight" 
                  stroke="hsl(var(--primary))" 
                  name="Weight (kg)"
                  strokeWidth={2}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="sleep" 
                  stroke="hsl(var(--accent))" 
                  name="Sleep (hrs)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Start logging your daily metrics to see your progress
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTracker;