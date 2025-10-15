import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Badge } from "@/Components/ui/badge"
import { Textarea } from "@/Components/ui/textarea"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/Components/ui/sheet"
import { Loader2, Plus, Upload, Edit, Trash2, AlertCircle } from "lucide-react"
import { useFaqs, createFaq, updateFaq, deleteFaq, bulkUploadFaqs, type FAQ, type CreateFAQInput } from "@/hooks/useFaqs"

export default function FAQsPage() {
  const { faqs, loading, error, refetch } = useFaqs()
  const [searchQuery, setSearchQuery] = useState("")
  const [addSheetOpen, setAddSheetOpen] = useState(false)
  const [editSheetOpen, setEditSheetOpen] = useState(false)
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Form states
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [tags, setTags] = useState("")

  const handleAdd = async () => {
    if (!question.trim() || !answer.trim()) {
      alert('Question and answer are required');
      return;
    }

    setSubmitting(true);
    try {
      const input: CreateFAQInput = {
        question: question.trim(),
        answer: answer.trim(),
        tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      };

      const { error } = await createFaq(input);
      if (error) throw new Error(error);

      await refetch();
      setAddSheetOpen(false);
      setQuestion("");
      setAnswer("");
      setTags("");
    } catch (err: any) {
      alert(`Failed to create FAQ: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedFaq) return;
    if (!question.trim() || !answer.trim()) {
      alert('Question and answer are required');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await updateFaq(selectedFaq.id, {
        question: question.trim(),
        answer: answer.trim(),
        tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      });
      if (error) throw new Error(error);

      await refetch();
      setEditSheetOpen(false);
      setSelectedFaq(null);
    } catch (err: any) {
      alert(`Failed to update FAQ: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (faqId: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const { error } = await deleteFaq(faqId);
      if (error) throw new Error(error);
      await refetch();
    } catch (err: any) {
      alert(`Failed to delete FAQ: ${err.message}`);
    }
  };

  const openEditSheet = (faq: FAQ) => {
    setSelectedFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setTags(faq.tags.join(', '));
    setEditSheetOpen(true);
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setSubmitting(true);

    try {
      const text = await file.text();
      let data: any[];

      if (file.name.endsWith('.json')) {
        data = JSON.parse(text);
      } else if (file.name.endsWith('.csv')) {
        // Simple CSV parser (question,answer,tags)
        const lines = text.split('\n').filter(l => l.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          return {
            question: values[0] || '',
            answer: values[1] || '',
            tags: values[2] ? values[2].split(';').map(t => t.trim()) : [],
          };
        });
      } else {
        throw new Error('Unsupported file format. Use .json or .csv');
      }

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('File must contain an array of FAQs');
      }

      const { successful, failed, total } = await bulkUploadFaqs(data);
      await refetch();
      
      alert(`Upload complete: ${successful}/${total} FAQs added${failed > 0 ? `, ${failed} failed` : ''}`);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload FAQs');
    } finally {
      setSubmitting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const filteredFaqs = faqs.filter(faq => {
    const q = searchQuery.toLowerCase();
    return (
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q) ||
      faq.tags.some(tag => tag.toLowerCase().includes(q))
    );
  });

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold mb-2">FAQ Library</h1>
          <p className="text-muted-foreground">Manage your knowledge base</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.csv"
            onChange={handleBulkUpload}
            className="hidden"
          />
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            disabled={submitting}
          >
            {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
            Bulk Upload
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={() => {
              setQuestion("");
              setAnswer("");
              setTags("");
              setAddSheetOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add FAQ
          </Button>
        </div>
      </div>

      {/* Upload Error */}
      {uploadError && (
        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">Upload Failed</p>
              <p className="text-sm text-red-700 mt-1">{uploadError}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setUploadError(null)}>
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card className="border-2">
        <CardContent className="p-4">
          <div className="relative">
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <Input 
              placeholder="Search FAQs..." 
              className="w-full pl-9 pr-3" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* FAQ Table */}
      <Card className="border-2">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#FF7A1A]" />
            </div>
          ) : error ? (
            <div className="text-center py-12 px-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 font-medium">Error loading FAQs</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
              <Button onClick={refetch} className="mt-4" variant="outline">
                Retry
              </Button>
            </div>
          ) : filteredFaqs.length === 0 ? (
            <div className="p-8 text-center">
              <h3 className="font-semibold mb-1">{faqs.length === 0 ? 'No FAQs yet' : 'No matching FAQs'}</h3>
              <p className="text-sm text-muted-foreground">
                {faqs.length === 0 ? 'Add one or bulk import CSV/JSON to get started.' : 'Try a different search query.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/70">
              {filteredFaqs.map((faq) => (
                <div key={faq.id} className="p-5 sm:p-6 hover:bg-muted/40 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-medium text-base sm:text-lg truncate">{faq.question}</h3>
                        <span className="shrink-0 text-xs text-muted-foreground">Updated {formatDate(faq.updatedAt)}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {faq.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="rounded-full">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="shrink-0 flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-foreground hover:bg-muted/60"
                        onClick={() => openEditSheet(faq)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(faq.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add FAQ Sheet */}
      <Sheet open={addSheetOpen} onOpenChange={setAddSheetOpen}>
        <SheetContent className="w-[90vw] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add New FAQ</SheetTitle>
            <SheetDescription>
              Create a new FAQ for your knowledge base
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question *</Label>
              <Input
                id="question"
                placeholder="e.g., How do I reset my password?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">Answer *</Label>
              <Textarea
                id="answer"
                placeholder="Provide a clear, helpful answer..."
                rows={6}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="e.g., account, login, password (comma-separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Separate tags with commas</p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setAddSheetOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={handleAdd}
                disabled={submitting}
              >
                {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Add FAQ
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit FAQ Sheet */}
      <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
        <SheetContent className="w-[90vw] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit FAQ</SheetTitle>
            <SheetDescription>
              Update this FAQ entry
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-question">Question *</Label>
              <Input
                id="edit-question"
                placeholder="e.g., How do I reset my password?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-answer">Answer *</Label>
              <Textarea
                id="edit-answer"
                placeholder="Provide a clear, helpful answer..."
                rows={6}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-tags">Tags</Label>
              <Input
                id="edit-tags"
                placeholder="e.g., account, login, password (comma-separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Separate tags with commas</p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setEditSheetOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={handleEdit}
                disabled={submitting}
              >
                {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Save Changes
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
