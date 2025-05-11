import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2, RefreshCw, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SupabaseClient } from "@supabase/supabase-js";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface AccountDiagnosticsProps {
  supabase: SupabaseClient;
  onSuccess?: () => void;
}

interface DiagnosticStep {
  name: string;
  status: "idle" | "loading" | "success" | "error" | "warning";
  message?: string;
  details?: string;
}

interface DiagnosticResult {
  authUser: any | null;
  publicUser: any | null;
  error?: string;
  suggestion?: string;
  conflictDetected: boolean;
}

export function AccountDiagnostics({ supabase, onSuccess }: AccountDiagnosticsProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [diagnosticSteps, setDiagnosticSteps] = useState<DiagnosticStep[]>([
    { name: "Kiểm tra phiên đăng nhập", status: "idle" },
    { name: "Kiểm tra xác thực", status: "idle" },
    { name: "Kiểm tra dữ liệu người dùng", status: "idle" },
    { name: "Kiểm tra xung đột", status: "idle" },
  ]);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>("diagnose");
  const [repairStatus, setRepairStatus] = useState<DiagnosticStep[]>([
    { name: "Xóa dữ liệu xung đột", status: "idle" },
    { name: "Tạo lại dữ liệu người dùng", status: "idle" },
    { name: "Xác nhận sửa chữa", status: "idle" },
  ]);
  const [repairResult, setRepairResult] = useState<any>(null);

  const updateStepStatus = (index: number, status: DiagnosticStep["status"], message?: string, details?: string) => {
    setDiagnosticSteps(prev => 
      prev.map((step, i) => 
        i === index ? { ...step, status, message, details } : step
      )
    );
  };

  const updateRepairStatus = (index: number, status: DiagnosticStep["status"], message?: string, details?: string) => {
    setRepairStatus(prev => 
      prev.map((step, i) => 
        i === index ? { ...step, status, message, details } : step
      )
    );
  };

  const runDiagnostics = async () => {
    setLoading(true);
    setDiagnosticResult(null);
    
    // Reset all steps
    diagnosticSteps.forEach((_, index) => {
      updateStepStatus(index, "idle");
    });

    try {
      // Step 1: Check session
      updateStepStatus(0, "loading", "Đang kiểm tra phiên đăng nhập...");
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        updateStepStatus(0, "error", "Không tìm thấy phiên đăng nhập", 
          "Vui lòng đăng nhập trước khi chạy công cụ chẩn đoán.");
        setDiagnosticResult({
          authUser: null,
          publicUser: null,
          error: "Người dùng chưa đăng nhập",
          suggestion: "Vui lòng đăng nhập trước khi sử dụng công cụ này.",
          conflictDetected: false
        });
        setLoading(false);
        return;
      }
      
      updateStepStatus(0, "success", "Phiên đăng nhập hợp lệ", 
        `ID người dùng: ${sessionData.session.user.id}`);
      
      // Step 2: Check auth.users
      updateStepStatus(1, "loading", "Đang kiểm tra thông tin xác thực...");
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        updateStepStatus(1, "error", "Không thể lấy thông tin người dùng từ auth.users", 
          userError?.message || "Lỗi không xác định");
        setDiagnosticResult({
          authUser: null,
          publicUser: null,
          error: "Không thể lấy thông tin xác thực",
          suggestion: "Vui lòng đăng xuất và đăng nhập lại.",
          conflictDetected: false
        });
        setLoading(false);
        return;
      }
      
      updateStepStatus(1, "success", "Thông tin xác thực hợp lệ", 
        `Email: ${userData.user.email}`);
      
      // Step 3: Check public.users
      updateStepStatus(2, "loading", "Đang kiểm tra dữ liệu người dùng...");
      const { data: publicUserData, error: publicUserError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userData.user.id)
        .single();
      
      let conflictDetected = false;
      
      if (publicUserError) {
        if (publicUserError.message.includes("No rows found")) {
          updateStepStatus(2, "warning", "Không tìm thấy dữ liệu người dùng trong bảng public.users", 
            "Người dùng có trong auth.users nhưng không có trong public.users");
          conflictDetected = true;
        } else {
          updateStepStatus(2, "error", "Lỗi khi kiểm tra bảng public.users", 
            publicUserError.message);
        }
      } else {
        updateStepStatus(2, "success", "Dữ liệu người dùng hợp lệ", 
          `Role: ${publicUserData.role}, Email: ${publicUserData.email}`);
      }
      
      // Step 4: Check for conflicts
      updateStepStatus(3, "loading", "Đang kiểm tra xung đột...");
      
      if (conflictDetected) {
        updateStepStatus(3, "warning", "Phát hiện xung đột giữa auth.users và public.users", 
          "Người dùng tồn tại trong auth.users nhưng không có trong public.users");
      } else if (!publicUserData) {
        updateStepStatus(3, "warning", "Không có dữ liệu người dùng", 
          "Cần tạo dữ liệu người dùng trong bảng public.users");
        conflictDetected = true;
      } else if (publicUserData.email !== userData.user.email) {
        updateStepStatus(3, "warning", "Email không khớp giữa auth.users và public.users", 
          `auth.users: ${userData.user.email}, public.users: ${publicUserData.email}`);
        conflictDetected = true;
      } else {
        updateStepStatus(3, "success", "Không phát hiện xung đột", 
          "Dữ liệu người dùng đồng bộ giữa auth.users và public.users");
      }
      
      setDiagnosticResult({
        authUser: userData.user,
        publicUser: publicUserData || null,
        conflictDetected
      });
      
      if (conflictDetected) {
        toast({
          title: "Phát hiện vấn đề",
          description: "Đã tìm thấy vấn đề với tài khoản của bạn. Bạn có thể sửa chữa nó ngay bây giờ.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Tài khoản bình thường",
          description: "Không phát hiện vấn đề với tài khoản của bạn."
        });
      }
      
    } catch (error) {
      console.error("Lỗi khi chạy chẩn đoán:", error);
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const repairAccount = async () => {
    if (!diagnosticResult?.authUser) {
      toast({
        title: "Lỗi",
        description: "Chưa có thông tin chẩn đoán. Vui lòng chạy chẩn đoán trước.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    repairStatus.forEach((_, index) => {
      updateRepairStatus(index, "idle");
    });
    setRepairResult(null);
    
    const authUser = diagnosticResult.authUser;
    
    try {
      // Step 1: Remove conflicting data if necessary
      updateRepairStatus(0, "loading", "Đang xóa dữ liệu xung đột...");
      
      // Check if user already exists in public.users
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();
      
      if (!checkError && existingUser) {
        // User exists, delete it first
        const { error: deleteError } = await supabase
          .from("users")
          .delete()
          .eq("id", authUser.id);
        
        if (deleteError) {
          updateRepairStatus(0, "error", "Không thể xóa dữ liệu người dùng hiện tại", 
            deleteError.message);
          throw new Error(`Không thể xóa dữ liệu người dùng: ${deleteError.message}`);
        }
        
        updateRepairStatus(0, "success", "Đã xóa dữ liệu người dùng xung đột");
      } else {
        updateRepairStatus(0, "success", "Không cần xóa dữ liệu", 
          "Không tìm thấy dữ liệu xung đột cần xóa");
      }
      
      // Step 2: Create user data
      updateRepairStatus(1, "loading", "Đang tạo lại dữ liệu người dùng...");
      
      const userMetadata = authUser.user_metadata || {};
      
      const newUserData = {
        id: authUser.id,
        email: authUser.email || '',
        full_name: userMetadata.full_name || userMetadata.name || authUser.email?.split('@')[0] || 'User',
        avatar_url: userMetadata.avatar_url || userMetadata.picture || "/placeholder.svg",
        role: "member" as const
      };
      
      const { data: createdUser, error: createError } = await supabase
        .from("users")
        .insert(newUserData)
        .select()
        .single();
      
      if (createError) {
        updateRepairStatus(1, "error", "Không thể tạo dữ liệu người dùng", 
          createError.message);
        throw new Error(`Không thể tạo dữ liệu người dùng: ${createError.message}`);
      }
      
      updateRepairStatus(1, "success", "Đã tạo lại dữ liệu người dùng thành công");
      
      // Step 3: Verify repair
      updateRepairStatus(2, "loading", "Đang xác nhận sửa chữa...");
      
      const { data: verifyData, error: verifyError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();
      
      if (verifyError || !verifyData) {
        updateRepairStatus(2, "error", "Không thể xác nhận sửa chữa", 
          verifyError?.message || "Không tìm thấy dữ liệu người dùng sau khi sửa chữa");
        throw new Error("Không thể xác nhận sửa chữa");
      }
      
      updateRepairStatus(2, "success", "Đã xác nhận sửa chữa thành công", 
        `User ID: ${verifyData.id}, Email: ${verifyData.email}, Role: ${verifyData.role}`);
      
      setRepairResult({
        success: true,
        message: "Tài khoản đã được sửa chữa thành công!",
        details: "Bạn có thể quay lại ứng dụng và sử dụng bình thường.",
        user: verifyData
      });
      
      toast({
        title: "Sửa chữa thành công",
        description: "Tài khoản của bạn đã được sửa chữa thành công!",
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error("Lỗi khi sửa chữa tài khoản:", error);
      setRepairResult({
        success: false,
        error: error instanceof Error ? error.message : "Lỗi không xác định",
        suggestion: "Vui lòng thử đăng nhập bằng OAuth (Google/GitHub) thay vì email/mật khẩu."
      });
      
      toast({
        title: "Lỗi khi sửa chữa tài khoản",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepStatus = (step: DiagnosticStep) => {
    switch (step.status) {
      case "loading":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  const getStatusClass = (status: DiagnosticStep["status"]) => {
    switch (status) {
      case "success":
        return "text-green-700 bg-green-50 border-green-100";
      case "error":
        return "text-red-700 bg-red-50 border-red-100";
      case "warning":
        return "text-yellow-700 bg-yellow-50 border-yellow-100";
      case "loading":
        return "text-blue-700 bg-blue-50 border-blue-100";
      default:
        return "text-gray-700 bg-gray-50 border-gray-100";
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Công cụ chẩn đoán và sửa chữa tài khoản</CardTitle>
        <CardDescription>
          Phát hiện và khắc phục các vấn đề liên quan đến xác thực và dữ liệu người dùng
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="diagnose">Chẩn đoán</TabsTrigger>
            <TabsTrigger value="repair" disabled={!diagnosticResult?.conflictDetected}>
              Sửa chữa
            </TabsTrigger>
          </TabsList>
          <TabsContent value="diagnose" className="space-y-4 pt-4">
            <Alert className="bg-blue-50 border-blue-100">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                Công cụ này sẽ giúp phát hiện và sửa chữa các vấn đề liên quan đến xác thực và dữ liệu người dùng.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4 mt-4">
              {diagnosticSteps.map((step, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md border ${
                    step.status !== "idle" ? getStatusClass(step.status) : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {renderStepStatus(step)}
                    <span className="font-medium">{step.name}</span>
                  </div>
                  {step.message && (
                    <div className="mt-1 ml-6">
                      <p className="text-sm">{step.message}</p>
                      {step.details && <p className="text-xs mt-1 opacity-80">{step.details}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {diagnosticResult && diagnosticResult.conflictDetected && (
              <Alert
                className="mt-4 bg-yellow-50 border-yellow-200 text-yellow-800"
              >
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription>
                  <p className="font-medium">Phát hiện vấn đề với tài khoản của bạn</p>
                  <p className="text-sm mt-1">
                    Có xung đột giữa dữ liệu xác thực và dữ liệu người dùng. Bạn có thể sửa chữa bằng cách chuyển sang tab Sửa chữa.
                  </p>
                </AlertDescription>
              </Alert>
            )}
            
            {diagnosticResult && !diagnosticResult.conflictDetected && !diagnosticResult.error && (
              <Alert
                className="mt-4 bg-green-50 border-green-200 text-green-800"
              >
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <p className="font-medium">Tài khoản của bạn hoạt động bình thường</p>
                  <p className="text-sm mt-1">
                    Không phát hiện vấn đề nào với tài khoản của bạn.
                  </p>
                </AlertDescription>
              </Alert>
            )}
            
            {diagnosticResult?.error && (
              <Alert
                className="mt-4 bg-red-50 border-red-200 text-red-800"
              >
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription>
                  <p className="font-medium">{diagnosticResult.error}</p>
                  {diagnosticResult.suggestion && (
                    <p className="text-sm mt-1">{diagnosticResult.suggestion}</p>
                  )}
                </AlertDescription>
              </Alert>
            )}
            
            {diagnosticResult && diagnosticResult.authUser && (
              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="details">
                  <AccordionTrigger>Thông tin chi tiết</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 text-sm">
                      <div className="border rounded-md p-3">
                        <h4 className="font-medium mb-2">Dữ liệu auth.users</h4>
                        <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                          {JSON.stringify(diagnosticResult.authUser, null, 2)}
                        </pre>
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <h4 className="font-medium mb-2">Dữ liệu public.users</h4>
                        {diagnosticResult.publicUser ? (
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                            {JSON.stringify(diagnosticResult.publicUser, null, 2)}
                          </pre>
                        ) : (
                          <p className="text-red-600">Không có dữ liệu</p>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </TabsContent>
          
          <TabsContent value="repair" className="space-y-4 pt-4">
            <Alert className="bg-yellow-50 border-yellow-100">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-700">
                Quá trình sửa chữa sẽ xóa và tạo lại dữ liệu người dùng của bạn. Các thiết lập cá nhân có thể sẽ bị đặt về mặc định.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4 mt-4">
              {repairStatus.map((step, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md border ${
                    step.status !== "idle" ? getStatusClass(step.status) : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {renderStepStatus(step)}
                    <span className="font-medium">{step.name}</span>
                  </div>
                  {step.message && (
                    <div className="mt-1 ml-6">
                      <p className="text-sm">{step.message}</p>
                      {step.details && <p className="text-xs mt-1 opacity-80">{step.details}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {repairResult && repairResult.success && (
              <Alert
                className="mt-4 bg-green-50 border-green-200 text-green-800"
              >
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <p className="font-medium">{repairResult.message}</p>
                  <p className="text-sm mt-1">{repairResult.details}</p>
                </AlertDescription>
              </Alert>
            )}
            
            {repairResult && !repairResult.success && (
              <Alert
                className="mt-4 bg-red-50 border-red-200 text-red-800"
              >
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription>
                  <p className="font-medium">Không thể sửa chữa tài khoản</p>
                  <p className="text-sm mt-1">{repairResult.error || "Đã xảy ra lỗi không xác định"}</p>
                  {repairResult.suggestion && (
                    <p className="text-xs mt-2">{repairResult.suggestion}</p>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        {activeTab === "diagnose" ? (
          <Button 
            onClick={runDiagnostics} 
            disabled={loading}
            className="flex items-center"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang chẩn đoán...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Chạy chẩn đoán
              </>
            )}
          </Button>
        ) : (
          <Button 
            onClick={repairAccount} 
            disabled={loading || !diagnosticResult?.conflictDetected}
            className="flex items-center"
            variant="destructive"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang sửa chữa...
              </>
            ) : (
              <>
                <AlertCircle className="mr-2 h-4 w-4" />
                Sửa chữa tài khoản
              </>
            )}
          </Button>
        )}
        
        {diagnosticResult?.conflictDetected && activeTab === "diagnose" && (
          <Button 
            onClick={() => setActiveTab("repair")}
            variant="outline"
          >
            Tiếp tục đến sửa chữa →
          </Button>
        )}
        
        {activeTab === "repair" && (
          <Button 
            onClick={() => setActiveTab("diagnose")}
            variant="outline"
          >
            ← Quay lại chẩn đoán
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 