import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Download, BarChart3 } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Statistics() {
  const { user, loading } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState<"all" | "ar" | "en" | "ml" | "ne">("all");

  const allResponsesQuery = trpc.forms.getAll.useQuery(undefined, {
    enabled: !!user && selectedLanguage === "all",
  });

  const filteredResponsesQuery = trpc.forms.getByLanguage.useQuery(
    { language: selectedLanguage as "ar" | "en" | "ml" | "ne" },
    { enabled: !!user && selectedLanguage !== "all" }
  );

  const responses = selectedLanguage === "all" 
    ? allResponsesQuery.data 
    : filteredResponsesQuery.data;

  const isLoading = selectedLanguage === "all" 
    ? allResponsesQuery.isLoading 
    : filteredResponsesQuery.isLoading;

  const languageNames = {
    all: "All Languages",
    ar: "العربية (Arabic)",
    en: "English",
    ml: "മലയാളം (Malayalam)",
    ne: "नेपाली (Nepali)",
  };

  const exportToCSV = () => {
    if (!responses || responses.length === 0) {
      return;
    }

    const headers = ["ID", "Language", "Name", "Company", "Phone", "Email", "Rating 1", "Rating 2", "Rating 3", "Rating 4", "Rating 5", "Rating 6", "Suggestions", "Date"];
    const rows = responses.map(r => [
      r.id,
      r.language,
      r.name,
      r.company,
      r.phone,
      r.email,
      r.rating1,
      r.rating2,
      r.rating3,
      r.rating4,
      r.rating5,
      r.rating6,
      r.suggestions || "",
      new Date(r.createdAt).toLocaleString(),
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `workshop-evaluations-${selectedLanguage}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please login to view statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href={getLoginUrl()}>Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Statistics</h1>
              <p className="text-slate-600 mt-2">View all workshop evaluation responses</p>
            </div>
            <Button onClick={exportToCSV} disabled={!responses || responses.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {/* Filter */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Filter by Language:</label>
                <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as any)}>
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(languageNames).map(([code, name]) => (
                      <SelectItem key={code} value={code}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Summary */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Total Responses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-900">{responses?.length || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Average Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-900">
                  {responses && responses.length > 0
                    ? (
                        responses.reduce((sum, r) => sum + (r.rating1 + r.rating2 + r.rating3 + r.rating4 + r.rating5 + r.rating6) / 6, 0) / responses.length
                      ).toFixed(1)
                    : "0.0"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Latest Response</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium text-slate-900">
                  {responses && responses.length > 0
                    ? new Date(responses[0].createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-900">
                  {selectedLanguage === "all" ? "4" : "1"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Responses Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Responses</CardTitle>
              <CardDescription>Detailed view of all evaluation submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center text-slate-600 py-8">Loading...</p>
              ) : responses && responses.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-900">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-900">Company</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-900">Language</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-900">Avg Rating</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-900">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {responses.map((response) => (
                        <tr key={response.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm text-slate-900">{response.name}</td>
                          <td className="px-4 py-3 text-sm text-slate-900">{response.company}</td>
                          <td className="px-4 py-3 text-sm text-slate-900">
                            {languageNames[response.language]}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-900">
                            {((response.rating1 + response.rating2 + response.rating3 + response.rating4 + response.rating5 + response.rating6) / 6).toFixed(1)}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-900">
                            {new Date(response.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No responses yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
