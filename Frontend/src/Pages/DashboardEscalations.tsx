import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Badge } from "@/Components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/Components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Loader2, AlertTriangle, CheckCircle2, Clock, ExternalLink } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { useEscalations, updateEscalation, type Escalation, type EscalationStatus } from "@/hooks/useEscalations"
import { apiFetch } from "@/lib/api"
import type { Summary } from "@/hooks/useChat"

const MOCK_AGENTS = ['Alex P.', 'Sarah M.', 'Mike R.'];

function StatusBadge({ status }: { status: EscalationStatus }) {
  const config = {
    'Resolved': { icon: CheckCircle2, color: 'bg-green-100 text-green-700 border-green-200' },
    'In Progress': { icon: Clock, color: 'bg-orange-100 text-orange-700 border-orange-200' },
    'Open': { icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  };
  
  const { icon: Icon, color } = config[status];
  
  return (
    <Badge className={`${color} border flex items-center gap-1 w-fit`}>
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  );
}

export default function EscalationsPage() {
  const { escalations, loading, error, refetch } = useEscalations();
  const [selectedEscalation, setSelectedEscalation] = useState<Escalation | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [updating, setUpdating] = useState(false);
  const [assignedTo, setAssignedTo] = useState<string>('');

  const handleView = async (esc: Escalation) => {
    setSelectedEscalation(esc);
    setAssignedTo(esc.assignedTo || '');
    setSheetOpen(true);
    
    // Fetch session summary
    if (esc.sessionId) {
      const { data } = await apiFetch<Summary>(`/sessions/${esc.sessionId}/summary`);
      if (data) setSummary(data);
    }
  };

  const handleUpdateStatus = async (newStatus: EscalationStatus) => {
    if (!selectedEscalation) return;
    
    setUpdating(true);
    try {
      const { error } = await updateEscalation(selectedEscalation.sessionId, { status: newStatus });
      if (error) throw new Error(error);
      
      // Refetch to update UI
      await refetch();
      
      // Update local state
      setSelectedEscalation({ ...selectedEscalation, status: newStatus });
    } catch (err: any) {
      alert(`Failed to update: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedEscalation || !assignedTo) return;
    
    setUpdating(true);
    try {
      const { error } = await updateEscalation(selectedEscalation.sessionId, { assignedTo });
      if (error) throw new Error(error);
      
      await refetch();
      setSelectedEscalation({ ...selectedEscalation, assignedTo });
    } catch (err: any) {
      alert(`Failed to assign: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl font-bold mb-2">Escalations</h1>
        <p className="text-muted-foreground">Manage tickets requiring human attention</p>
      </div>

      {/* Escalations Table */}
      <Card className="border-2">
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#FF7A1A]" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 font-medium">Error loading escalations</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
              <Button onClick={refetch} className="mt-4" variant="outline">
                Retry
              </Button>
            </div>
          ) : escalations.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No active escalations</h3>
              <p className="text-muted-foreground">Your AI's on top of things! 🎉</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Ticket ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Reason</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Assigned to</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Created</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {escalations.map((esc) => (
                    <tr key={esc.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{esc.id}</td>
                      <td className="py-3 px-4 text-muted-foreground">{esc.user}</td>
                      <td className="py-3 px-4 text-muted-foreground">{esc.reason}</td>
                      <td className="py-3 px-4">
                        <span className="text-sm">{esc.assignedTo || <span className="text-muted-foreground italic">Unassigned</span>}</span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={esc.status} />
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {formatTime(esc.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleView(esc)}
                        >
                          View
                        </Button>
                        {esc.status !== 'Resolved' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={async () => {
                              if (confirm('Mark this escalation as resolved?')) {
                                setSelectedEscalation(esc);
                                await handleUpdateStatus('Resolved');
                              }
                            }}
                          >
                            Resolve
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[90vw] sm:w-[540px] overflow-y-auto">
          {selectedEscalation && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Escalation {selectedEscalation.id}
                </SheetTitle>
                <SheetDescription>
                  Session: {selectedEscalation.sessionId}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Status Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Current Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <StatusBadge status={selectedEscalation.status} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">User:</span>
                      <span className="text-sm font-medium">{selectedEscalation.user}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Reason:</span>
                      <span className="text-sm font-medium">{selectedEscalation.reason}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Created:</span>
                      <span className="text-sm">{formatTime(selectedEscalation.createdAt)}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Assignment Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Assignment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground block mb-2">Assign to:</label>
                      <div className="flex gap-2">
                        <Select value={assignedTo} onValueChange={setAssignedTo}>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select agent..." />
                          </SelectTrigger>
                          <SelectContent>
                            {MOCK_AGENTS.map((agent) => (
                              <SelectItem key={agent} value={agent}>
                                {agent}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button 
                          onClick={handleAssign} 
                          disabled={updating || !assignedTo || assignedTo === selectedEscalation.assignedTo}
                          size="sm"
                        >
                          {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Assign'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Summary Card */}
                {summary && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Conversation Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {summary.summary}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold mb-3">Actions</h3>
                  
                  {selectedEscalation.status === 'Open' && (
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => handleUpdateStatus('In Progress')}
                      disabled={updating}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Mark In Progress
                    </Button>
                  )}
                  
                  {selectedEscalation.status !== 'Resolved' && (
                    <Button 
                      className="w-full" 
                      variant="default"
                      onClick={() => handleUpdateStatus('Resolved')}
                      disabled={updating}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Resolve Escalation
                    </Button>
                  )}
                  
                  <Link to="/dashboard/conversations/$id" params={{ id: selectedEscalation.sessionId }}>
                    <Button className="w-full" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Full Conversation
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
