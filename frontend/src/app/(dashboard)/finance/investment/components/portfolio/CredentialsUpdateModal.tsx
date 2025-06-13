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
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface CredentialsUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (credentials: { apiKey: string; secretKey: string; passphrase?: string }) => void;
  loading?: boolean;
}

export function CredentialsUpdateModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loading = false 
}: CredentialsUpdateModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [passphrase, setPassphrase] = useState("");

  const handleSubmit = () => {
    if (!apiKey || !secretKey) return;
    
    onSubmit({
      apiKey,
      secretKey,
      passphrase: passphrase || undefined
    });
    
    // Reset form
    setApiKey("");
    setSecretKey("");
    setPassphrase("");
  };

  const handleClose = () => {
    setApiKey("");
    setSecretKey("");
    setPassphrase("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[30rem]">
        <DialogHeader>
          <DialogTitle>Update API Credentials</DialogTitle>
          <DialogDescription>
            Enter your updated exchange API credentials to retry portfolio creation.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apiKey" className="text-right">
              API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="col-span-3"
              placeholder="Enter your API key"
              disabled={loading}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="secretKey" className="text-right">
              Secret Key
            </Label>
            <Input
              id="secretKey"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="col-span-3"
              placeholder="Enter your secret key"
              disabled={loading}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="passphrase" className="text-right">
              Passphrase
            </Label>
            <Input
              id="passphrase"
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="col-span-3"
              placeholder="Enter passphrase (if required)"
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
            disabled={!apiKey || !secretKey || loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update & Retry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 