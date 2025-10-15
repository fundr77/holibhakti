import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";

const Payment = () => {
  const navigate = useNavigate();
  const whatsappNumber = "+919998805082";

  const handleWhatsAppRedirect = () => {
    const message = encodeURIComponent(
      "Hi! I'm interested in upgrading to Premium plan for Bhakti Health & Wellness. Please share the UPI QR code for payment."
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
    toast.success("Redirecting to WhatsApp...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="container mx-auto max-w-4xl py-12">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          ← Back
        </Button>

        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Upgrade to Premium</CardTitle>
            <CardDescription>Unlock your full wellness potential</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-4">Premium Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Access to all free content plus premium video library</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Personalized health analytics tracking (weight, mood, food, sleep)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Content tailored to your specific health condition</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>One-on-one coaching sessions via WhatsApp</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Weekly motivation and progress check-ins</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Future AI-powered personalized recommendations</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">How to Upgrade</h3>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    To upgrade your account to Premium, please contact us on WhatsApp. We'll share the payment details and UPI QR code with you.
                  </p>
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={handleWhatsAppRedirect}
                      className="w-full"
                      size="lg"
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Contact on WhatsApp
                    </Button>
                    <p className="text-sm text-center text-muted-foreground">
                      WhatsApp: {whatsappNumber}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Payment Instructions:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Click the WhatsApp button above to contact us</li>
                  <li>We'll send you the UPI QR code for payment</li>
                  <li>Make the payment and share the screenshot with us</li>
                  <li>Your account will be upgraded to Premium within 24 hours</li>
                  <li>You'll receive a confirmation message on WhatsApp</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payment;