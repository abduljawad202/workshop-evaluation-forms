import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ArrowLeft, Mail, Plus, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Admin() {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const managersQuery = trpc.managers.getAll.useQuery(undefined, {
    enabled: !!user,
  });

  const addManagerMutation = trpc.managers.add.useMutation({
    onSuccess: () => {
      toast.success("Manager email added successfully!");
      setEmail("");
      setName("");
      managersQuery.refetch();
    },
    onError: (error) => {
      toast.error("Error adding manager: " + error.message);
    },
  });

  const deleteManagerMutation = trpc.managers.delete.useMutation({
    onSuccess: () => {
      toast.success("Manager email deleted successfully!");
      managersQuery.refetch();
    },
    onError: (error) => {
      toast.error("Error deleting manager: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addManagerMutation.mutate({ email, name });
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
            <CardDescription>Please login to access the admin panel</CardDescription>
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

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Panel</h1>
            <p className="text-slate-600 mt-2">Manage manager email addresses</p>
          </div>

          {/* Add Manager Form */}
          <Card>
            <CardHeader>
              <CardTitle>Add Manager Email</CardTitle>
              <CardDescription>
                Add email addresses to receive evaluation notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="manager@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name (Optional)</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Manager Name"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={addManagerMutation.isPending}
                >
                  {addManagerMutation.isPending ? "Adding..." : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Manager
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Managers List */}
          <Card>
            <CardHeader>
              <CardTitle>Manager Emails</CardTitle>
              <CardDescription>
                All managers will receive notifications when forms are submitted
              </CardDescription>
            </CardHeader>
            <CardContent>
              {managersQuery.isLoading ? (
                <p className="text-center text-slate-600">Loading...</p>
              ) : managersQuery.data && managersQuery.data.length > 0 ? (
                <div className="space-y-2">
                  {managersQuery.data.map((manager) => (
                    <div
                      key={manager.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-slate-600" />
                        <div>
                          <p className="font-medium text-slate-900">{manager.email}</p>
                          {manager.name && (
                            <p className="text-sm text-slate-600">{manager.name}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteManagerMutation.mutate({ id: manager.id })}
                        disabled={deleteManagerMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-600 py-8">
                  No manager emails added yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
