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

export default function FormMalayalam() {
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
      toast.success("മൂല്യനിരണയം വിജയകരമായി സമർപ്പിച്ചു!");
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
      toast.error("സമർപ്പിക്കുന്നതിൽ പിശക്: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.rating1 || !formData.rating2 || !formData.rating3 || 
        !formData.rating4 || !formData.rating5 || !formData.rating6) {
      toast.error("എല്ലാ ചോദ്യങ്ങളും റേറ്റുചെയ്യുക");
      return;
    }

    submitMutation.mutate({
      language: "ml",
      ...formData,
    });
  };

  const questions = [
    "വർക്ക്‌ഷോപ്പ് ഉള്ളടക്കത്തിൽ നിങ്ങൾ എത്രത്തോളം സംതൃപ്തരാണ്?",
    "പരിശീലകന്റെ പ്രകടനം എങ്ങനെ വിലയിരുത്തും?",
    "നൽകിയ മെറ്റീരിയലുകൾ എത്രത്തോളം ഉപയോഗപ്രദമായിരുന്നു?",
    "മൊത്തത്തിലുള്ള സംഘടന എങ്ങനെ വിലയിരുത്തും?",
    "നിങ്ങൾ പഠിച്ചത് നിങ്ങളുടെ ജോലിയിൽ പ്രയോഗിക്കാൻ കഴിയുമോ?",
    "ഈ വർക്ക്‌ഷോപ്പ് മറ്റുള്ളവർക്ക് ശുപാർശ ചെയ്യുമോ?",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              ഹോമിലേക്ക് മടങ്ങുക
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl text-center">വർക്ക്‌ഷോപ്പ് മൂല്യനിരണയ ഫോം</CardTitle>
            <CardDescription className="text-purple-50 text-center text-lg">
              സുരക്ഷിത ശുചിത്വം, തിരുമ്മൽ സേവനങ്ങളിലെ ആരോഗ്യ ആവശ്യകതകൾ
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900 border-b pb-2">വ്യക്തിഗത വിവരങ്ങൾ</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name">പേര് *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">കമ്പനി പേര് *</Label>
                  <Input
                    id="company"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">ബന്ധപ്പെടാനുള്ള നമ്പർ *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">ഇമെയിൽ വിലാസം *</Label>
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
                <h3 className="text-xl font-semibold text-slate-900 border-b pb-2">മൂല്യനിരണയം</h3>
                
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
                      <span>മോശം (1)</span>
                      <span>മികച്ചത് (5)</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="suggestions">നിർദ്ദേശങ്ങളും അഭിപ്രായങ്ങളും</Label>
                <Textarea
                  id="suggestions"
                  rows={4}
                  value={formData.suggestions}
                  onChange={(e) => setFormData({ ...formData, suggestions: e.target.value })}
                  placeholder="നിങ്ങളുടെ നിർദ്ദേശങ്ങളോ അഭിപ്രായങ്ങളോ പങ്കിടുക..."
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90 text-lg py-6"
                disabled={submitMutation.isPending}
              >
                {submitMutation.isPending ? "സമർപ്പിക്കുന്നു..." : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    മൂല്യനിരണയം സമർപ്പിക്കുക
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
