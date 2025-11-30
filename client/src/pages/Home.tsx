import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Languages, FileText, BarChart3, Settings } from "lucide-react";

export default function Home() {
  const languages = [
    { code: "ar", name: "العربية", nameEn: "Arabic", dir: "rtl", gradient: "from-emerald-500 to-teal-600" },
    { code: "en", name: "English", nameEn: "English", dir: "ltr", gradient: "from-blue-500 to-indigo-600" },
    { code: "ml", name: "മലയാളം", nameEn: "Malayalam", dir: "ltr", gradient: "from-purple-500 to-pink-600" },
    { code: "ne", name: "नेपाली", nameEn: "Nepali", dir: "ltr", gradient: "from-orange-500 to-red-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Workshop Evaluation</h1>
                <p className="text-sm text-slate-600">نموذج تقييم ورشة العمل</p>
              </div>
            </div>
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
              <Languages className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Choose Your Language
            </h2>
            <p className="text-lg text-slate-600 mb-2">
              اختر لغتك المفضلة لملء نموذج التقييم
            </p>
            <p className="text-sm text-slate-500">
              Select your preferred language to fill the evaluation form
            </p>
          </div>

          {/* Language Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {languages.map((lang) => (
              <Link key={lang.code} href={`/form/${lang.code}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-400">
                  <CardHeader>
                    <div className={`inline-flex px-4 py-2 rounded-lg bg-gradient-to-r ${lang.gradient} mb-3`}>
                      <CardTitle className="text-2xl font-bold text-white" dir={lang.dir}>
                        {lang.name}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {lang.nameEn} Evaluation Form
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className={`w-full bg-gradient-to-r ${lang.gradient} hover:opacity-90`}
                      size="lg"
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      Start Evaluation
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/statistics">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">View Statistics</h3>
                    <p className="text-sm text-slate-600">عرض الإحصائيات والنتائج</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/admin">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Settings className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Admin Panel</h3>
                    <p className="text-sm text-slate-600">لوحة الإدارة والإعدادات</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="container mx-auto px-4 py-6 text-center text-slate-600 text-sm">
          <p>Workshop Evaluation System • نظام تقييم ورش العمل</p>
        </div>
      </footer>
    </div>
  );
}
