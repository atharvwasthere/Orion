import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Building2, Plus, Loader2 } from 'lucide-react';
import {
  fetchCompanies,
  createCompany,
  getActiveCompanyId,
  getActiveCompanyName,
  switchCompany,
  type Company,
} from '@/lib/companyContext';

export function CompanySwitcher() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeId] = useState<string | null>(getActiveCompanyId());
  const [activeName] = useState<string | null>(getActiveCompanyName());
  const [loading, setLoading] = useState(true);
  const [createSheetOpen, setCreateSheetOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const data = await fetchCompanies();
      setCompanies(data);
    } catch (err) {
      console.error('Failed to load companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitch = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      // Clear session data before switching to ensure fresh session for new company
      localStorage.removeItem('sessionId');
      localStorage.removeItem('sessionCompanyId');
      switchCompany(company);
    }
  };

  const handleCreateCompany = async () => {
    if (!newCompanyName.trim()) {
      alert('Company name is required');
      return;
    }

    setCreating(true);
    try {
      const newCompany = await createCompany(newCompanyName.trim());
      if (newCompany) {
        // Switch to the new company immediately
        switchCompany(newCompany);
      }
    } catch (err: any) {
      alert(`Failed to create company: ${err.message}`);
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading companies...</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Select value={activeId || undefined} onValueChange={handleSwitch}>
          <SelectTrigger className="w-56 bg-background">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Select company">
                {activeName || 'Select company'}
              </SelectValue>
            </div>
          </SelectTrigger>
          <SelectContent>
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCreateSheetOpen(true)}
          className="shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Create Company Sheet */}
      <Sheet open={createSheetOpen} onOpenChange={setCreateSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Create New Company</SheetTitle>
            <SheetDescription>
              Add a new company to manage separately
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name *</Label>
              <Input
                id="company-name"
                placeholder="e.g., Acme Inc."
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateCompany();
                  }
                }}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setCreateSheetOpen(false)}
                disabled={creating}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={handleCreateCompany}
                disabled={creating || !newCompanyName.trim()}
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create & Switch'
                )}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
