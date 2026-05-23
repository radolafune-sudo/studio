
"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  ArrowDownCircle, 
  CheckCircle2, 
  ShieldCheck,
  Wallet,
  Save,
  MessageSquare,
  Send,
  Bitcoin,
  CircleDollarSign,
  TrendingUp,
  Activity,
  History,
  Search,
  Lock,
  XCircle,
  Smartphone,
  CreditCard
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useCollection, useDoc, updateUserProfile, increment, sendSupportMessage } from "@/firebase";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const WALLET_TYPES = [
  { id: 'btc', name: "Bitcoin (BTC)", icon: <Bitcoin className="h-4 w-4" /> },
  { id: 'usdt', name: "USDT TRC20", icon: <CircleDollarSign className="h-4 w-4" /> },
  { id: 'trx', name: "TRON (TRX)", icon: <TrendingUp className="h-4 w-4" /> },
  { id: 'eth', name: "Ethereum (ETH)", icon: <Activity className="h-4 w-4" /> },
  { id: 'usdc', name: "USDC ERC20", icon: <CircleDollarSign className="h-4 w-4" /> },
  { id: 'skrill', name: "Skrill", icon: <CreditCard className="h-4 w-4" /> },
  { id: 'mtn', name: "MTN (UG)", icon: <Smartphone className="h-4 w-4" /> },
  { id: 'vodacom', name: "Vodacom (TSH)", icon: <Smartphone className="h-4 w-4" /> }
];

const ADMIN_ACCESS_KEY = "ADMIN@2024";

export default function AdminPanel() {
  const { data: users } = useCollection<any>('users');
  const { data: deposits } = useCollection<any>('deposits');
  const { data: globalSettings } = useDoc<any>('settings/global');
  const { data: allMessages } = useCollection<any>('support_messages');
  
  const { toast } = useToast();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [accessKeyInput, setAccessKeyInput] = useState("");
  const [walletEdits, setWalletEdits] = useState<Record<string, string>>({});
  const [editingBalance, setEditingBalance] = useState<Record<string, string>>({});
  const [replyText, setReplyText] = useState("");
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("deposits");
  const [searchQuery, setSearchQuery] = useState("");

  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessKeyInput === ADMIN_ACCESS_KEY) {
      setIsAdminAuthenticated(true);
      toast({ title: "Access Granted", description: "Welcome back, Administrator." });
    } else {
      toast({ variant: "destructive", title: "Access Denied", description: "Invalid administration key." });
    }
  };

  const handleUpdateWallet = async (walletId: string) => {
    const newVal = walletEdits[walletId];
    if (!newVal) return;

    const currentWallets = globalSettings?.wallets || {};
    const updatedWallets = { ...currentWallets, [walletId]: newVal };
    
    await updateUserProfile('global', { wallets: updatedWallets }, 'settings');

    toast({ title: "Wallet Updated", description: `${walletId.toUpperCase()} details changed successfully.` });
    setWalletEdits(prev => {
      const next = { ...prev };
      delete next[walletId];
      return next;
    });
  };

  const handleApproveDeposit = async (id: string, userId: string, amount: number) => {
    await updateUserProfile(userId, { balance: increment(amount) });
    await updateUserProfile(id, { status: "approved" }, 'deposits');
    toast({ title: "Deposit Approved", description: `$${amount} credited to user available capital.` });
  };

  const handleDeclineDeposit = async (id: string) => {
    await updateUserProfile(id, { status: "rejected" }, 'deposits');
    toast({ variant: "destructive", title: "Deposit Declined", description: "User will receive a blockchain verification error." });
  };

  const handleUpdateBalance = async (userId: string) => {
    const val = editingBalance[userId];
    if (val === undefined || isNaN(Number(val))) return;
    await updateUserProfile(userId, { balance: Number(val) });
    toast({ title: "Balance Updated", description: `User balance set to $${Number(val).toFixed(2)}.` });
  };

  const handleSendReply = async () => {
    if (!replyText || !activeChatId) return;
    await sendSupportMessage(activeChatId, replyText, true);
    setReplyText("");
  };

  const handleStartChat = (userId: string) => {
    setActiveChatId(userId);
    setActiveTab("support");
  };

  const sortedUsers = useMemo(() => {
    if (!users) return [];
    return [...users]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .filter(u => 
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.uid?.includes(searchQuery)
      );
  }, [users, searchQuery]);

  const chatGroups = (allMessages || []).reduce((acc: any, msg: any) => {
    if (!acc[msg.userId]) acc[msg.userId] = [];
    acc[msg.userId].push(msg);
    return acc;
  }, {});

  const selectedUserHistory = deposits?.filter((d: any) => d.userId === selectedUserId) || [];

  if (!isAdminAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8F9FC]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-primary p-10 text-white text-center">
              <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl font-black uppercase tracking-tight">Admin Access</CardTitle>
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest mt-2">Restricted Area</p>
            </CardHeader>
            <CardContent className="p-10 bg-white">
              <form onSubmit={handleAccessSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Enter Administration Key</Label>
                  <Input 
                    required 
                    type="password" 
                    value={accessKeyInput}
                    onChange={(e) => setAccessKeyInput(e.target.value)}
                    placeholder="••••••••" 
                    className="h-14 bg-secondary/30 border-none text-center font-black text-xl tracking-[0.5em]" 
                  />
                </div>
                <Button type="submit" className="w-full h-14 bg-primary text-white font-black uppercase tracking-widest rounded-xl shadow-lg">
                  Verify Identity
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FC] font-body">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-black uppercase tracking-tight text-[#1A1A1A]">Admin Control</h1>
            </div>
            <p className="text-muted-foreground font-medium">Real-time oversight and system management.</p>
          </div>
          <div className="flex items-center gap-2 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <p className="text-[9px] font-black uppercase text-muted-foreground leading-none">Registered Clients</p>
              <p className="font-black text-lg text-black">{users?.length || 0}</p>
            </div>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-white border p-1 rounded-2xl h-14 w-full md:w-auto overflow-x-auto">
            <TabsTrigger value="deposits" className="rounded-xl px-6 font-black uppercase tracking-widest text-[10px] shrink-0">
              <ArrowDownCircle className="h-4 w-4 mr-2" /> Deposits
            </TabsTrigger>
            <TabsTrigger value="users" className="rounded-xl px-6 font-black uppercase tracking-widest text-[10px] shrink-0">
              <Users className="h-4 w-4 mr-2" /> Users
            </TabsTrigger>
            <TabsTrigger value="wallets" className="rounded-xl px-6 font-black uppercase tracking-widest text-[10px] shrink-0">
              <Wallet className="h-4 w-4 mr-2" /> Wallets
            </TabsTrigger>
            <TabsTrigger value="support" className="rounded-xl px-6 font-black uppercase tracking-widest text-[10px] shrink-0">
              <MessageSquare className="h-4 w-4 mr-2" /> Support
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallets">
            <Card className="rounded-[2rem] border-none shadow-sm bg-white">
              <CardHeader className="p-8 border-b">
                <CardTitle className="text-sm font-black uppercase text-primary">Global Configuration</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {WALLET_TYPES.map(type => (
                    <div key={type.id} className="space-y-3 bg-muted/10 p-4 rounded-2xl border border-muted/20">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2">
                        {type.icon} {type.name}
                      </Label>
                      <div className="flex gap-2">
                        <Input 
                          placeholder={globalSettings?.wallets?.[type.id] || "Enter details..."}
                          className="h-12 bg-white border-none font-mono text-xs shadow-sm"
                          value={walletEdits[type.id] || ""}
                          onChange={(e) => setWalletEdits({...walletEdits, [type.id]: e.target.value})}
                        />
                        <Button onClick={() => handleUpdateWallet(type.id)} size="icon" className="h-12 w-12 bg-primary rounded-xl">
                          <Save className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deposits" className="space-y-4">
            {deposits?.filter((d: any) => d.status === 'pending').length === 0 ? (
              <div className="p-20 text-center bg-white rounded-[2rem] border border-dashed">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                <p className="font-bold text-muted-foreground uppercase text-xs">No pending requests</p>
              </div>
            ) : (
              deposits?.filter((d: any) => d.status === 'pending').map((deposit: any) => (
                <Card key={deposit.id} className="border-none shadow-sm rounded-[2rem] bg-white">
                  <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Wallet className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-black text-lg">{deposit.userEmail}</h3>
                        <div className="flex flex-col gap-0.5">
                          <p className="text-[10px] font-black uppercase text-primary tracking-tight">Method: {deposit.walletType}</p>
                          <p className="text-[10px] font-mono text-muted-foreground break-all">TXID: {deposit.transactionId}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-black uppercase text-muted-foreground">Amount</p>
                      <p className="text-2xl font-black text-accent">${deposit.amount.toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleApproveDeposit(deposit.id, deposit.userId, deposit.amount)} className="bg-accent h-12 px-6 font-black uppercase rounded-xl">
                        Approve
                      </Button>
                      <Button onClick={() => handleDeclineDeposit(deposit.id)} variant="destructive" className="h-12 px-6 font-black uppercase rounded-xl">
                        Decline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search users by name, email or ID..." 
                className="pl-12 h-14 rounded-2xl bg-white border-none shadow-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="bg-white rounded-[2rem] border overflow-hidden overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-muted/30 border-b">
                  <tr>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest">Client</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest">Actions</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest">Balance Edit</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-right">Current Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.map((user: any) => (
                    <tr key={user.uid} className={cn("border-b transition-colors cursor-pointer hover:bg-muted/5", selectedUserId === user.uid && "bg-primary/5")}>
                      <td className="p-6" onClick={() => setSelectedUserId(user.uid)}>
                        <p className="font-bold">{user.name || user.email}</p>
                        <p className="text-[10px] font-mono text-muted-foreground">{user.uid}</p>
                      </td>
                      <td className="p-6">
                        <Button 
                          onClick={() => handleStartChat(user.uid)} 
                          size="sm" 
                          variant="outline" 
                          className="rounded-full h-8 px-4 text-[10px] font-black uppercase border-primary/20 text-primary"
                        >
                          <MessageSquare className="h-3 w-3 mr-2" /> Message
                        </Button>
                      </td>
                      <td className="p-6">
                        <div className="flex gap-2">
                          <Input 
                            type="number"
                            className="h-10 w-32 font-bold"
                            value={editingBalance[user.uid] || ""}
                            onChange={(e) => setEditingBalance({...editingBalance, [user.uid]: e.target.value})}
                          />
                          <Button onClick={() => handleUpdateBalance(user.uid)} size="icon" className="bg-primary h-10 w-10 rounded-xl">
                            <Save className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                      <td className="p-6 font-black font-mono text-primary text-xl text-right">${(user.balance || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedUserId && (
              <Card className="rounded-[2rem] border-none shadow-lg bg-white overflow-hidden animate-in slide-in-from-bottom-4">
                <CardHeader className="p-8 bg-muted/20 border-b flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-black uppercase">Transaction History</CardTitle>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">Client: {selectedUserId}</p>
                  </div>
                  <History className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead className="bg-muted/10 border-b">
                      <tr>
                        <th className="p-4 text-[9px] font-black uppercase">Date</th>
                        <th className="p-4 text-[9px] font-black uppercase">Type</th>
                        <th className="p-4 text-[9px] font-black uppercase">Status</th>
                        <th className="p-4 text-[9px] font-black uppercase text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedUserHistory.length === 0 ? (
                        <tr><td colSpan={4} className="p-12 text-center text-xs font-bold text-muted-foreground uppercase">No transactions found</td></tr>
                      ) : (
                        selectedUserHistory.map((h: any) => (
                          <tr key={h.id} className="border-b last:border-0">
                            <td className="p-4 text-[10px] font-mono">{new Date(h.timestamp).toLocaleDateString()}</td>
                            <td className="p-4 text-[10px] font-bold uppercase">{h.walletType || 'Deposit'}</td>
                            <td className="p-4">
                              <Badge className={cn(
                                "text-[8px] font-black uppercase",
                                h.status === 'approved' ? "bg-accent" : h.status === 'rejected' ? "bg-destructive" : "bg-yellow-500"
                              )}>
                                {h.status}
                              </Badge>
                            </td>
                            <td className="p-4 text-right font-black text-sm">${h.amount.toFixed(2)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="support" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 rounded-[2rem] border-none shadow-sm h-[600px] flex flex-col">
              <CardHeader className="bg-muted/20 p-6 border-b"><CardTitle className="text-xs font-black uppercase">Active Chats</CardTitle></CardHeader>
              <CardContent className="p-0 flex-1 overflow-y-auto">
                {Object.entries(chatGroups).length === 0 ? (
                  <div className="p-12 text-center text-[10px] font-black uppercase text-muted-foreground">No conversations</div>
                ) : (
                  Object.entries(chatGroups).map(([userId, msgs]: any) => (
                    <div key={userId} onClick={() => setActiveChatId(userId)} className={cn("p-6 border-b cursor-pointer transition-all", activeChatId === userId ? "bg-primary/5 border-l-4 border-l-primary" : "hover:bg-muted/5")}>
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-black text-xs uppercase truncate w-32">{userId}</p>
                        <p className="text-[8px] font-bold text-muted-foreground">{new Date(msgs[msgs.length-1].timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">{msgs[msgs.length-1].text}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
            <Card className="md:col-span-2 rounded-[2rem] border-none shadow-sm h-[600px] flex flex-col overflow-hidden">
              {activeChatId ? (
                <>
                  <div className="bg-primary/10 p-4 border-b flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-black">
                      {activeChatId.slice(0, 2).toUpperCase()}
                    </div>
                    <p className="text-[10px] font-black uppercase">Client: {activeChatId}</p>
                  </div>
                  <CardContent className="flex-1 overflow-y-auto p-8 space-y-4 bg-muted/5">
                    {(chatGroups[activeChatId] || []).map((msg: any, i: number) => (
                      <div key={i} className={cn("flex flex-col", msg.isAdmin ? "items-end" : "items-start")}>
                        <div className={cn(
                          "p-4 rounded-2xl text-[13px] font-medium max-w-[80%] shadow-sm",
                          msg.isAdmin ? "bg-primary text-white rounded-tr-none" : "bg-white border rounded-tl-none"
                        )}>
                          {msg.text}
                        </div>
                        <p className="text-[8px] mt-1 text-muted-foreground font-bold uppercase">{msg.isAdmin ? 'Admin' : 'Client'}</p>
                      </div>
                    ))}
                  </CardContent>
                  <div className="p-6 bg-white border-t flex gap-3">
                    <Input 
                      value={replyText} 
                      onChange={(e) => setReplyText(e.target.value)} 
                      onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                      placeholder="Type your reply here..." 
                      className="h-14 rounded-xl border-none bg-muted/30 font-medium" 
                    />
                    <Button onClick={handleSendReply} className="h-14 w-14 rounded-xl bg-primary shadow-lg shadow-primary/20"><Send className="h-6 w-6" /></Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground uppercase font-black text-xs gap-4">
                  <MessageSquare className="h-12 w-12 opacity-20" />
                  Select a chat to begin messaging
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
