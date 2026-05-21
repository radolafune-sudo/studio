
"use client";

import { useState } from "react";
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
  Activity
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useCollection, useDoc, updateUserProfile, initializeFirebase, increment, sendSupportMessage } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { cn } from "@/lib/utils";

const WALLET_TYPES = [
  { id: 'btc', name: "Bitcoin (BTC)", icon: <Bitcoin className="h-4 w-4" /> },
  { id: 'usdt', name: "USDT TRC20", icon: <CircleDollarSign className="h-4 w-4" /> },
  { id: 'trx', name: "TRON (TRX)", icon: <TrendingUp className="h-4 w-4" /> },
  { id: 'eth', name: "Ethereum (ETH)", icon: <Activity className="h-4 w-4" /> },
  { id: 'usdc', name: "USDC ERC20", icon: <CircleDollarSign className="h-4 w-4" /> }
];

export default function AdminPanel() {
  const { data: users } = useCollection<any>('users');
  const { data: deposits } = useCollection<any>('deposits');
  const { data: globalSettings } = useDoc<any>('settings/global');
  const { data: allMessages } = useCollection<any>('support_messages');
  
  const { toast } = useToast();
  const [walletEdits, setWalletEdits] = useState<Record<string, string>>({});
  const [editingBalance, setEditingBalance] = useState<Record<string, string>>({});
  const [replyText, setReplyText] = useState("");
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const handleUpdateWallet = async (walletId: string) => {
    const newVal = walletEdits[walletId];
    if (!newVal) return;

    const updatedWallets = { ...globalSettings?.wallets, [walletId]: newVal };
    const { firestore } = initializeFirebase();
    
    if (firestore && typeof firestore.collection !== 'undefined') {
      await setDoc(doc(firestore, "settings", "global"), {
        wallets: updatedWallets
      }, { merge: true });
    } else {
      await updateUserProfile('global', { wallets: updatedWallets }, 'settings');
    }

    toast({ title: "Wallet Updated", description: `${walletId.toUpperCase()} address changed successfully.` });
    setWalletEdits(prev => {
      const next = { ...prev };
      delete next[walletId];
      return next;
    });
  };

  const handleApproveDeposit = async (id: string, userId: string, amount: number) => {
    await updateUserProfile(userId, { balance: increment(amount) });
    const { firestore } = initializeFirebase();
    if (firestore && typeof firestore.collection !== 'undefined') {
      await setDoc(doc(firestore, "deposits", id), { status: "approved" }, { merge: true });
    } else {
      await updateUserProfile(id, { status: "approved" }, 'deposits');
    }
    toast({ title: "Approved Fast", description: `$${amount} credited instantly.` });
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

  const chatGroups = (allMessages || []).reduce((acc: any, msg: any) => {
    if (!acc[msg.userId]) acc[msg.userId] = [];
    acc[msg.userId].push(msg);
    return acc;
  }, {});

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

        <Tabs defaultValue="deposits" className="space-y-8">
          <TabsList className="bg-white border p-1 rounded-2xl h-14 w-full md:w-auto">
            <TabsTrigger value="deposits" className="rounded-xl px-6 font-black uppercase tracking-widest text-[10px]">
              <ArrowDownCircle className="h-4 w-4 mr-2" /> Deposits
            </TabsTrigger>
            <TabsTrigger value="users" className="rounded-xl px-6 font-black uppercase tracking-widest text-[10px]">
              <Users className="h-4 w-4 mr-2" /> Users
            </TabsTrigger>
            <TabsTrigger value="wallets" className="rounded-xl px-6 font-black uppercase tracking-widest text-[10px]">
              <Wallet className="h-4 w-4 mr-2" /> Wallets
            </TabsTrigger>
            <TabsTrigger value="support" className="rounded-xl px-6 font-black uppercase tracking-widest text-[10px]">
              <MessageSquare className="h-4 w-4 mr-2" /> Support
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallets">
            <Card className="rounded-[2rem] border-none shadow-sm bg-white">
              <CardHeader className="p-8 border-b">
                <CardTitle className="text-sm font-black uppercase text-primary">Global Wallet Configuration</CardTitle>
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
                          placeholder={globalSettings?.wallets?.[type.id] || "Enter address..."}
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
                      <div>
                        <h3 className="font-black text-lg">{deposit.userEmail}</h3>
                        <p className="text-[10px] font-mono text-muted-foreground">{deposit.transactionId}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-black uppercase text-muted-foreground">Amount</p>
                      <p className="text-2xl font-black text-accent">${deposit.amount.toFixed(2)}</p>
                    </div>
                    <Button onClick={() => handleApproveDeposit(deposit.id, deposit.userId, deposit.amount)} className="bg-accent h-12 px-10 font-black uppercase rounded-xl">
                      Approve Fast
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="users">
            <div className="bg-white rounded-[2rem] border overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-muted/30 border-b">
                  <tr>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest">Client</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest">Balance Edit</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest">Current Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user: any) => (
                    <tr key={user.uid} className="border-b">
                      <td className="p-6 font-bold">{user.name || user.email}</td>
                      <td className="p-6">
                        <div className="flex gap-2">
                          <Input 
                            type="number"
                            className="h-10 w-32 font-bold"
                            value={editingBalance[user.uid] || ""}
                            onChange={(e) => setEditingBalance({...editingBalance, [user.uid]: e.target.value})}
                          />
                          <Button onClick={() => handleUpdateBalance(user.uid)} size="icon" className="bg-primary h-10 w-10">
                            <Save className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                      <td className="p-6 font-black font-mono text-primary text-xl">${(user.balance || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="support" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 rounded-[2rem] border-none shadow-sm h-[500px] flex flex-col">
              <CardHeader className="bg-muted/20 p-6 border-b"><CardTitle className="text-xs font-black uppercase">Chats</CardTitle></CardHeader>
              <CardContent className="p-0 flex-1 overflow-y-auto">
                {Object.entries(chatGroups).map(([userId, msgs]: any) => (
                  <div key={userId} onClick={() => setActiveChatId(userId)} className={cn("p-4 border-b cursor-pointer", activeChatId === userId && "bg-primary/5")}>
                    <p className="font-black text-xs uppercase truncate">{userId.slice(0, 10)}...</p>
                    <p className="text-[10px] text-muted-foreground truncate">{msgs[msgs.length-1].text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="md:col-span-2 rounded-[2rem] border-none shadow-sm h-[500px] flex flex-col">
              {activeChatId ? (
                <>
                  <CardContent className="flex-1 overflow-y-auto p-6 space-y-3 bg-muted/5">
                    {(chatGroups[activeChatId] || []).map((msg: any, i: number) => (
                      <div key={i} className={cn("flex flex-col", msg.isAdmin ? "items-end" : "items-start")}>
                        <div className={cn("p-3 rounded-xl text-sm max-w-[80%]", msg.isAdmin ? "bg-primary text-white" : "bg-white border shadow-sm")}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                  <div className="p-4 bg-white border-t flex gap-2">
                    <Input value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type reply..." className="h-12 rounded-xl" />
                    <Button onClick={handleSendReply} className="h-12 w-12 rounded-xl bg-primary"><Send className="h-5 w-5" /></Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground uppercase font-black text-xs">Select a chat</div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
