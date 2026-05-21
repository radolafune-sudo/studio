
"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck,
  Search,
  Wallet,
  Settings,
  Save
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useCollection, useDoc, updateUserProfile, initializeFirebase, increment } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function AdminPanel() {
  const { data: users } = useCollection<any>('users');
  const { data: deposits } = useCollection<any>('deposits');
  const { data: globalSettings } = useDoc<any>('settings/global');
  
  const { toast } = useToast();
  const [newWallet, setNewWallet] = useState("");
  const [editingBalance, setEditingBalance] = useState<Record<string, string>>({});

  const handleUpdateWallet = async () => {
    if (!newWallet) return;
    
    // Use path-based update for settings
    const { firestore } = initializeFirebase();
    if (firestore) {
      await setDoc(doc(firestore, "settings", "global"), {
        walletAddress: newWallet
      }, { merge: true });
    } else {
      // Mock mode handles this too
      await updateUserProfile('global', { walletAddress: newWallet }, 'settings');
    }

    toast({
      title: "Settings Updated",
      description: "Global wallet address has been updated for all clients.",
    });
    setNewWallet("");
  };

  const handleApproveDeposit = async (id: string, userId: string, amount: number) => {
    await updateUserProfile(userId, {
      balance: increment(amount)
    });
    
    // Mark deposit as approved (mock/real)
    // For simplicity in this demo, we just toast
    toast({
      title: "Deposit Approved",
      description: `The amount of $${amount} has been added to the user's account.`,
    });
  };

  const handleUpdateBalance = async (userId: string) => {
    const val = editingBalance[userId];
    if (val === undefined || isNaN(Number(val))) return;

    await updateUserProfile(userId, {
      balance: Number(val)
    });

    toast({
      title: "Balance Updated",
      description: `User balance set to $${Number(val).toFixed(2)}.`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FC] font-body">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-black uppercase tracking-tight text-[#1A1A1A]">System Control</h1>
            </div>
            <p className="text-muted-foreground font-medium">Global platform administration and oversight.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="pr-4">
                <p className="text-[10px] font-black uppercase text-muted-foreground leading-none mb-1">Total Users</p>
                <p className="font-black text-lg text-black">{users?.length || 0}</p>
              </div>
            </div>
          </div>
        </header>

        <Tabs defaultValue="settings" className="space-y-8">
          <TabsList className="bg-white border p-1 rounded-2xl h-14">
            <TabsTrigger value="settings" className="rounded-xl px-8 font-black uppercase tracking-widest text-[11px]">
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </TabsTrigger>
            <TabsTrigger value="deposits" className="rounded-xl px-8 font-black uppercase tracking-widest text-[11px]">
              <ArrowDownCircle className="h-4 w-4 mr-2" />
              Deposits
            </TabsTrigger>
            <TabsTrigger value="users" className="rounded-xl px-8 font-black uppercase tracking-widest text-[11px]">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="animate-in fade-in duration-500">
            <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
              <CardHeader className="bg-primary/5 p-8 border-b border-primary/10">
                <CardTitle className="text-xl font-black uppercase flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  Wallet Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4 max-w-2xl">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Client Wallet Address</Label>
                    <div className="p-4 bg-muted/30 rounded-xl font-mono text-sm break-all border border-muted">
                      {globalSettings?.walletAddress || '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Update Wallet Address</Label>
                    <div className="flex gap-3">
                      <Input 
                        placeholder="Enter new wallet address" 
                        className="h-12 bg-white" 
                        value={newWallet}
                        onChange={(e) => setNewWallet(e.target.value)}
                      />
                      <Button onClick={handleUpdateWallet} className="bg-accent hover:bg-accent/90 px-8 h-12 rounded-xl font-black uppercase text-xs tracking-widest">
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deposits" className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {deposits.length === 0 ? (
                <div className="p-20 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="font-bold text-muted-foreground">No pending verifications</p>
                </div>
              ) : (
                deposits.map(deposit => (
                  <Card key={deposit.id} className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
                    <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center">
                          <Wallet className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-black text-xl">{deposit.userEmail}</h3>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-[10px] font-mono bg-muted/50 border-none">
                              TX: {deposit.transactionId}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground font-bold uppercase">{new Date(deposit.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center md:items-end gap-1">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Deposit Amount</p>
                        <p className="text-3xl font-black text-accent">${deposit.amount.toFixed(2)}</p>
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <Button 
                          onClick={() => handleApproveDeposit(deposit.id, deposit.userId, deposit.amount)}
                          className="flex-1 bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest h-12 rounded-xl"
                        >
                          Approve
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input className="pl-12 h-14 rounded-2xl bg-white border-none shadow-sm font-medium" placeholder="Search users by name, email or ID..." />
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Client</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Edit Balance</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Portfolio Value</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.uid} className="border-b hover:bg-muted/10 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                            {user.name?.[0] || 'U'}
                          </div>
                          <div>
                            <p className="font-black text-sm uppercase">{user.name}</p>
                            <p className="text-[10px] font-medium text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <Input 
                            type="number"
                            placeholder="Set Balance"
                            className="h-10 w-32 rounded-lg text-sm font-bold"
                            value={editingBalance[user.uid] || ""}
                            onChange={(e) => setEditingBalance({...editingBalance, [user.uid]: e.target.value})}
                          />
                          <Button 
                            size="icon" 
                            className="bg-accent hover:bg-accent/90 h-10 w-10"
                            onClick={() => handleUpdateBalance(user.uid)}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                      <td className="p-6">
                        <p className="font-black font-mono text-lg text-primary">${(user.balance || 0).toFixed(2)}</p>
                      </td>
                      <td className="p-6">
                        <Badge className="bg-accent/10 text-accent font-bold text-[9px] border-none px-3">ACTIVE</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
