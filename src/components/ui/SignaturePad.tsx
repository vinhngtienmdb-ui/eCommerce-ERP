import React, { useRef, forwardRef, useImperativeHandle } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/src/components/ui/button";
import { ShieldCheck } from "lucide-react";

interface SignaturePadProps {
  penColor?: string;
  canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
}

export interface SignaturePadHandle {
  clear: () => void;
  toDataURL: () => string;
  isEmpty: () => boolean;
}

export const SignaturePad = forwardRef<SignaturePadHandle, SignaturePadProps>(
  ({ penColor = "black", canvasProps }, ref) => {
    const sigCanvas = useRef<SignatureCanvas>(null);

    useImperativeHandle(ref, () => ({
      clear: () => sigCanvas.current?.clear(),
      toDataURL: () => sigCanvas.current?.toDataURL() || "",
      isEmpty: () => sigCanvas.current?.isEmpty() || true,
    }));

    return (
      <div className="space-y-4">
        <div className="h-48 w-full bg-white rounded-xl border border-slate-200 relative group cursor-crosshair overflow-hidden">
          <SignatureCanvas
            ref={sigCanvas}
            penColor={penColor}
            canvasProps={{
              width: 500,
              height: 200,
              ...canvasProps,
              className: `sigCanvas ${canvasProps?.className || ""}`,
            }}
          />
          <div className="absolute bottom-2 right-2 text-[10px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" /> Encrypted Session
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => sigCanvas.current?.clear()}>
          Clear Signature
        </Button>
      </div>
    );
  }
);

SignaturePad.displayName = "SignaturePad";
