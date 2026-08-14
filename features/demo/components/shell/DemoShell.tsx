"use client";

import type { DemoRole } from "../../constants/demoRoles";
import { DemoAiChatBubble } from "../ai/DemoAiChatBubble";
import { DemoHeader } from "./DemoHeader";
import { DemoSidebar } from "./DemoSidebar";
import { DemoNextStepBar } from "./DemoNextStepBar";
import { DemoReadOnlyBanner } from "./DemoReadOnlyBanner";

export function DemoShell({
  role,
  children,
}: {
  role: DemoRole;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen min-h-0 bg-slate-50">
      <DemoSidebar role={role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DemoReadOnlyBanner />
        <DemoHeader role={role} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
          <DemoNextStepBar role={role} />
        </main>
      </div>
      <DemoAiChatBubble role={role} />
    </div>
  );
}
