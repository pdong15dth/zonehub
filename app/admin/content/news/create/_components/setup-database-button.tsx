"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Database, Loader2, Copy, Check, Code } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function SetupDatabaseButton() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [tableExists, setTableExists] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [setupStep, setSetupStep] = useState<string>('idle');
  const [sqlScript, setSqlScript] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSqlDialog, setShowSqlDialog] = useState(false);

  // Get the current origin for API calls
  const getBaseUrl = () => typeof window !== 'undefined' ? window.location.origin : '';

  // Check if table exists on component mount
  useEffect(() => {
    const checkTableExists = async () => {
      try {
        setIsChecking(true);
        
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/db-setup/check-articles-table`);
        const data = await response.json();
        
        if (!response.ok) {
          console.error("Error checking table:", data);
          setError(data.error || "Could not check if table exists");
        } else {
          setTableExists(data.exists);
        }
      } catch (error) {
        console.error("Error checking table:", error);
        setError(error instanceof Error ? error.message : String(error));
      } finally {
        setIsChecking(false);
      }
    };
    
    checkTableExists();
  }, []);

  const setupDatabase = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSqlScript(null);
      
      const baseUrl = getBaseUrl();
      
      // Create the table directly
      setSetupStep('creating_table');
      const tableResponse = await fetch(`${baseUrl}/api/db-setup/create-articles-table`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const responseData = await tableResponse.json();
      
      if (!tableResponse.ok) {
        console.error("Error creating articles table:", responseData);
        
        // If the API provided SQL to run manually, save it
        if (responseData.sql) {
          setSqlScript(responseData.sql);
          setShowSqlDialog(true);
        }
        
        throw new Error(responseData.message || "Could not create articles table");
      }
      
      toast({
        title: "Database setup successful",
        description: "The articles table has been created.",
      });
      
      setTableExists(true);
    } catch (error) {
      console.error("Error setting up database:", error);
      setError(error instanceof Error ? error.message : String(error));
      
      toast({
        variant: "destructive",
        title: "Database setup failed",
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsLoading(false);
      setSetupStep('idle');
    }
  };

  const copyToClipboard = () => {
    if (sqlScript) {
      navigator.clipboard.writeText(sqlScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "SQL copied to clipboard",
        description: "Paste it in the Supabase SQL Editor to create the table",
      });
    }
  };

  // If still checking or table exists, don't show the button
  if (isChecking) {
    return (
      <div className="w-full p-4 flex items-center justify-center">
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        <span className="text-sm text-muted-foreground">Checking database...</span>
      </div>
    );
  }
  
  // If table already exists, show success message
  if (tableExists) {
    return (
      <Alert className="mb-4 bg-green-50 border-green-200">
        <Database className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Database Ready</AlertTitle>
        <AlertDescription className="text-green-700">
          The articles table exists. You can create and publish articles.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Alert className="mb-4 bg-amber-50 border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Database Setup Required</AlertTitle>
        <AlertDescription className="text-amber-700">
          The articles table does not exist in your database. You need to set it up before you can create articles.
          {sqlScript && (
            <div className="mt-2">
              <p>Automatic creation failed, but you can manually create the table using SQL.</p>
              <Button
                variant="outline" 
                size="sm"
                className="mt-2 text-amber-800 border-amber-300 hover:bg-amber-100"
                onClick={() => setShowSqlDialog(true)}
              >
                <Code className="h-4 w-4 mr-2" />
                View SQL Script
              </Button>
            </div>
          )}
        </AlertDescription>
      </Alert>
      
      <Button
        variant="outline"
        className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
        onClick={setupDatabase}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {setupStep === 'creating_table' 
              ? "Creating articles table..."
              : "Setting up database..."}
          </>
        ) : (
          <>
            <Database className="mr-2 h-4 w-4" />
            Setup Articles Database Table
          </>
        )}
      </Button>
      
      {sqlScript && (
        <Dialog open={showSqlDialog} onOpenChange={setShowSqlDialog}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Manual SQL Setup</DialogTitle>
              <DialogDescription>
                Copy this SQL and run it in the Supabase SQL Editor to create the articles table.
              </DialogDescription>
            </DialogHeader>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-[400px]">
              <pre className="text-sm">{sqlScript}</pre>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSqlDialog(false)}>Close</Button>
              <Button onClick={copyToClipboard} disabled={copied}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy to Clipboard
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 