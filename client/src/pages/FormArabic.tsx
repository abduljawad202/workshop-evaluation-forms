import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ArrowRight, Send } from "lucide-react";
import { Link } from "wouter";

export default function FormArabic() {
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
      toast.success("تم إرسال التقييم بنجاح!");
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
      toast.error("حدث خطأ أثناء الإرسال: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.rating1 || !formData.rating2 || !formData.rating3 || 
        !formData.rating4 || !formData.rating5 || !formData.rating6) {
      toast.error("الرجاء تقييم جميع الأسئلة");
      return;
    }

    submitMutation.mutate({
      language: "ar",
      ...formData,
    });
  };

  const questions = [
    "مدى رضاك عن محتوى الورشة؟",
    "كيف تقيم أداء المدرب؟",
    "ما مدى فائدة المواد المقدمة؟",
    "كيف تقيم التنظيم العام للورشة؟",
    "هل يمكنك تطبيق ما تعلمته في عملك؟",
    "هل توصي بهذه الورشة للآخرين؟",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50" dir="rtl">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة للرئيسية
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl text-center">نموذج تقييم ورشة العمل</CardTitle>
            <CardDescription className="text-emerald-50 text-center text-lg">
              نظافة آمنة، الاشتراطات الصحية في خدمات التدليك والاسترخاء
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900 border-b pb-2">المعلومات الشخصية</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="text-right"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">اسم المنشأة *</Label>
                  <Input
                    id="company"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="text-right"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">رقم التواصل *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="text-right"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="text-right"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Rating Questions */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-900 border-b pb-2">التقييم</h3>
                
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
                      <span>ممتاز (5)</span>
                      <span>ضعيف (1)</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggestions */}
              <div className="space-y-2">
                <Label htmlFor="suggestions">الاقتراحات والملاحظات</Label>
                <Textarea
                  id="suggestions"
                  rows={4}
                  value={formData.suggestions}
                  onChange={(e) => setFormData({ ...formData, suggestions: e.target.value })}
                  className="text-right"
                  placeholder="شاركنا بأي اقتراحات أو ملاحظات..."
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-lg py-6"
                disabled={submitMutation.isPending}
              >
                {submitMutation.isPending ? "جاري الإرسال..." : (
                  <>
                    <Send className="w-5 h-5 ml-2" />
                    إرسال التقييم
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
