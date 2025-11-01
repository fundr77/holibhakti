-- Create personalized plans table
CREATE TABLE public.personalized_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('diet', 'exercise', 'combined')),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  goals TEXT[],
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.personalized_plans ENABLE ROW LEVEL SECURITY;

-- RLS policies for personalized_plans
CREATE POLICY "Users can view their own plans"
ON public.personalized_plans FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all plans"
ON public.personalized_plans FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_personalized_plans_updated_at
BEFORE UPDATE ON public.personalized_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes
CREATE INDEX idx_personalized_plans_user ON public.personalized_plans(user_id);
CREATE INDEX idx_personalized_plans_active ON public.personalized_plans(is_active);