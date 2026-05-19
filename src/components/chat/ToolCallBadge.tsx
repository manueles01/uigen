"use client";

import { Loader2 } from "lucide-react";

interface ToolCallBadgeProps {
  toolName: string;
  args: Record<string, unknown>;
  state: "call" | "partial-call" | "result";
}

function getFileName(path: unknown): string {
  if (typeof path !== "string" || !path) return "file";
  return path.split("/").pop() || path;
}

export function getToolLabel(toolName: string, args: Record<string, unknown>): string {
  if (toolName === "str_replace_editor") {
    const name = getFileName(args.path);
    switch (args.command) {
      case "create":    return `Creating ${name}`;
      case "str_replace":
      case "insert":    return `Editing ${name}`;
      case "view":      return `Reading ${name}`;
      case "undo_edit": return `Reverting ${name}`;
      default:          return `Editing ${name}`;
    }
  }
  if (toolName === "file_manager") {
    const name = getFileName(args.path);
    switch (args.command) {
      case "rename": return `Renaming ${name}`;
      case "delete": return `Deleting ${name}`;
      default:       return name;
    }
  }
  return toolName;
}

export function ToolCallBadge({ toolName, args, state }: ToolCallBadgeProps) {
  const label = getToolLabel(toolName, args);
  const isDone = state === "result";

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600 flex-shrink-0" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
