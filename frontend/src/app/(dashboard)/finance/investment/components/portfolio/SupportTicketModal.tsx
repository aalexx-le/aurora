import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface SupportTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ticket: { subject: string; description: string; category?: string; priority?: string }) => void;
  loading?: boolean;
  executionId?: number | null;
}

export function SupportTicketModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loading = false,
  executionId 
}: SupportTicketModalProps) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("HIGH");

  const handleSubmit = () => {
    if (!subject || !description) return;
    
    onSubmit({
      subject,
      description,
      category: category || undefined,
      priority: priority || undefined
    });
    
    // Reset form
    setSubject("");
    setDescription("");
    setCategory("");
    setPriority("HIGH");
  };

  const handleClose = () => {
    setSubject("");
    setDescription("");
    setCategory("");
    setPriority("HIGH");
    onClose();
  };

  // Set default subject when modal opens
  const defaultSubject = executionId 
    ? `Portfolio Creation Failed - Execution ${executionId}` 
    : "Portfolio Creation Issue";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Contact Support</DialogTitle>
          <DialogDescription>
            Describe the issue you&apos;re experiencing and our support team will assist you.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              Subject
            </Label>
            <Input
              id="subject"
              value={subject || defaultSubject}
              onChange={(e) => setSubject(e.target.value)}
              className="col-span-3"
              placeholder="Brief description of the issue"
              disabled={loading}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory} disabled={loading}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CRYPTO_PORTFOLIO">Portfolio Creation</SelectItem>
                <SelectItem value="API_CREDENTIALS">API Credentials</SelectItem>
                <SelectItem value="EXCHANGE_CONNECTION">Exchange Connection</SelectItem>
                <SelectItem value="TECHNICAL_ISSUE">Technical Issue</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select value={priority} onValueChange={setPriority} disabled={loading}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3 min-h-[100px]"
              placeholder="Please provide detailed information about the issue, including any error messages you received..."
              disabled={loading}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!subject || !description || loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 