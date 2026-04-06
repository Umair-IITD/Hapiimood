import { SignUp } from "@clerk/nextjs";
import Navbar from "@/components/layout/Navbar";

export default function Page() {
  return (
    <div className="relative isolate flex min-h-screen flex-col items-center justify-center bg-bg px-4">
      <Navbar />
      
      <div className="relative z-10 w-full max-w-md mt-20">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Create your safe space</h1>
          <p className="text-sm text-text-muted">Anonymity is our default. Your privacy is our priority.</p>
        </div>
        
        <SignUp
          appearance={{
            variables: {
              colorBackground: "#FFFFFF",
              colorText: "#1E293B",
              colorInputBackground: "#FFFFFF",
              colorInputText: "#1E293B",
            },
            elements: {
              card: "bg-white p-8 border border-white/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] rounded-3xl",
              headerTitle: "hidden", // We have a custom title above the component
              headerSubtitle: "hidden",
              socialButtonsBlockButton: "bg-white hover:bg-slate-50 border-slate-200 transition-all duration-300 shadow-sm py-3",
              socialButtonsBlockButtonText: "text-slate-900 font-bold text-sm",
              socialButtonsBlockButtonArrow: "text-slate-400",
              formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 w-full text-base py-6 shadow-indigo-200/50 shadow-lg transition-all font-bold",
              dividerLine: "bg-slate-200",
              dividerText: "text-slate-500 font-bold text-[10px] uppercase tracking-widest",
              formFieldLabel: "text-slate-700 text-[11px] font-bold uppercase tracking-[0.15em] mb-2",
              formFieldInput: "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 transition-all py-3 px-4 rounded-xl",
              footerActionText: "text-slate-600 font-medium",
              footerActionLink: "text-indigo-600 hover:text-indigo-700 transition-colors duration-300 font-bold",
              identityPreviewText: "text-slate-900 font-bold",
              identityPreviewEditButtonIcon: "text-indigo-600",
            },
          }}
        />
      </div>
      
      <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-teal/10 blur-[120px] pointer-events-none" />
    </div>
  );
}
