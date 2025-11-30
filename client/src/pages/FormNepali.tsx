import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ArrowLeft, Send } from "lucide-react";
import { Link } from "wouter";

export default function FormNepali() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    rating1: 0,
    rating2: 0,
    rating3: 0,
    rating4: 0,
    rating5: 0,
    rating6: 0,
    suggestions: "",
  });

  const submitMutation = trpc.forms.submit.useMutation({
    onSuccess: () => {
      toast.success("मूल्यांकन सफलतापूर्वक पेश गरियो!");
      setFormData({
        name: "",
        company: "",
        phone: "",
        email: "",
        rating1: 0,
        rating2: 0,
        rating3: 0,
        rating4: 0,
        rating5: 0,
        rating6: 0,
        suggestions: "",
      });
    },
    onError: (error) => {
      toast.error("पेश गर्दा त्रुटि: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.rating1 || !formData.rating2 || !formData.rating3 || 
        !formData.rating4 || !formData.rating5 || !formData.rating6) {
      toast.error("कृपया सबै प्रश्नहरूको मूल्यांकन गर्नुहोस्");
      return;
    }

    submitMutation.mutate({
      language: "ne",
      ...formData,
    });
  };

  const questions = [
    "कार्यशाला सामग्रीसँग तपाईं कति सन्तुष्ट हुनुहुन्छ?",
    "तपाईं प्रशिक्षकको प्रदर्शनलाई कसरी मूल्यांकन गर्नुहुन्छ?",
    "प्रदान गरिएका सामग्रीहरू कति उपयोगी थिए?",
    "तपाईं समग्र संगठनलाई कसरी मूल्यांकन गर्नुहुन्छ?",
    "के तपाईं आफ्नो काममा सिकेको कुरा लागू गर्न सक्नुहुन्छ?",
    "के तपाईं यो कार्यशाला अरूलाई सिफारिस गर्नुहुन्छ?",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              गृहपृष्ठमा फर्कनुहोस्
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl text-center">कार्यशाला मूल्यांकन फॉर्म</CardTitle>
            <CardDescription className="text-orange-50 text-center text-lg">
              सुरक्षित स्वच्छता, मालिश सेवाओं में स्वास्थ्य आवश्यकताएं
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900 border-b pb-2">व्यक्तिगत जानकारी</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name">नाम *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">कम्पनीको नाम *</Label>
                  <Input
                    id="company"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">सम्पर्क नम्बर *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">इमेल ठेगाना *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-900 border-b pb-2">मूल्यांकन</h3>
                
                {questions.map((question, index) => (
                  <div key={index} className="space-y-3 p-4 bg-slate-50 rounded-lg">
                    <Label className="text-base font-medium">{question} *</Label>
                    <RadioGroup
                      value={formData[`rating${index + 1}` as keyof typeof formData]?.toString()}
                      onValueChange={(value) => setFormData({ ...formData, [`rating${index + 1}`]: parseInt(value) })}
                      className="flex gap-4 justify-center"
                    >
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <div key={rating} className="flex flex-col items-center gap-2">
                          <Label htmlFor={`q${index + 1}-${rating}`} className="text-sm font-normal cursor-pointer">
                            {rating}
                          </Label>
                          <RadioGroupItem value={rating.toString()} id={`q${index + 1}-${rating}`} />
                        </div>
                      ))}
                    </RadioGroup>
                    <div className="flex justify-between text-xs text-slate-600 px-2">
                      <span>कमजोर (1)</span>
                      <span>उत्कृष्ट (5)</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="suggestions">सुझाव र टिप्पणीहरू</Label>
                <Textarea
                  id="suggestions"
                  rows={4}
                  value={formData.suggestions}
                  onChange={(e) => setFormData({ ...formData, suggestions: e.target.value })}
                  placeholder="आफ्ना सुझाव वा टिप्पणीहरू साझा गर्नुहोस्..."
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90 text-lg py-6"
                disabled={submitMutation.isPending}
              >
                {submitMutation.isPending ? "पेश गर्दै..." : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    मूल्यांकन पेश गर्नुहोस्
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
