import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge, getToolLabel } from "../ToolCallBadge";

afterEach(() => {
  cleanup();
});

// --- getToolLabel unit tests ---

test("getToolLabel: str_replace_editor create", () => {
  expect(getToolLabel("str_replace_editor", { command: "create", path: "src/App.jsx" })).toBe("Creating App.jsx");
});

test("getToolLabel: str_replace_editor str_replace", () => {
  expect(getToolLabel("str_replace_editor", { command: "str_replace", path: "src/Button.tsx" })).toBe("Editing Button.tsx");
});

test("getToolLabel: str_replace_editor insert", () => {
  expect(getToolLabel("str_replace_editor", { command: "insert", path: "src/Card.tsx" })).toBe("Editing Card.tsx");
});

test("getToolLabel: str_replace_editor view", () => {
  expect(getToolLabel("str_replace_editor", { command: "view", path: "src/App.jsx" })).toBe("Reading App.jsx");
});

test("getToolLabel: str_replace_editor undo_edit", () => {
  expect(getToolLabel("str_replace_editor", { command: "undo_edit", path: "src/App.jsx" })).toBe("Reverting App.jsx");
});

test("getToolLabel: file_manager rename", () => {
  expect(getToolLabel("file_manager", { command: "rename", path: "src/Old.jsx", new_path: "src/New.jsx" })).toBe("Renaming Old.jsx");
});

test("getToolLabel: file_manager delete", () => {
  expect(getToolLabel("file_manager", { command: "delete", path: "src/Unused.tsx" })).toBe("Deleting Unused.tsx");
});

test("getToolLabel: uses filename from nested path", () => {
  expect(getToolLabel("str_replace_editor", { command: "create", path: "src/components/ui/Badge.tsx" })).toBe("Creating Badge.tsx");
});

test("getToolLabel: falls back to 'file' when path is empty", () => {
  expect(getToolLabel("str_replace_editor", { command: "create", path: "" })).toBe("Creating file");
});

test("getToolLabel: falls back to toolName for unknown tool", () => {
  expect(getToolLabel("unknown_tool", {})).toBe("unknown_tool");
});

// --- ToolCallBadge render tests ---

test("renders spinner when state is 'call'", () => {
  const { container } = render(
    <ToolCallBadge toolName="str_replace_editor" args={{ command: "create", path: "App.jsx" }} state="call" />
  );
  expect(container.querySelector(".animate-spin")).toBeTruthy();
  expect(container.querySelector(".bg-emerald-500")).toBeFalsy();
});

test("renders spinner when state is 'partial-call'", () => {
  const { container } = render(
    <ToolCallBadge toolName="str_replace_editor" args={{ command: "create", path: "App.jsx" }} state="partial-call" />
  );
  expect(container.querySelector(".animate-spin")).toBeTruthy();
  expect(container.querySelector(".bg-emerald-500")).toBeFalsy();
});

test("renders green dot when state is 'result'", () => {
  const { container } = render(
    <ToolCallBadge toolName="str_replace_editor" args={{ command: "create", path: "App.jsx" }} state="result" />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeTruthy();
  expect(container.querySelector(".animate-spin")).toBeFalsy();
});

test("renders friendly label text", () => {
  render(
    <ToolCallBadge toolName="str_replace_editor" args={{ command: "str_replace", path: "src/Button.tsx" }} state="call" />
  );
  expect(screen.getByText("Editing Button.tsx")).toBeDefined();
});

test("renders delete label for file_manager", () => {
  render(
    <ToolCallBadge toolName="file_manager" args={{ command: "delete", path: "src/Old.tsx" }} state="result" />
  );
  expect(screen.getByText("Deleting Old.tsx")).toBeDefined();
});
