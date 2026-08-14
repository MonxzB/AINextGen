export const contentPillars = [
  { key: "prompt", label: "Prompt", category: "Prompting", description: "Prompt mẫu và kỹ thuật giao tiếp với AI." },
  { key: "automation", label: "Automation", category: "Automation", description: "Workflow và tự động hóa công việc bằng AI." },
  { key: "roadmap", label: "Lộ trình", category: "Lộ trình", description: "Lộ trình học AI theo mục tiêu và cấp độ." },
] as const;

export const tutorialCategories = ["Prompting", "Automation", "Lộ trình", "AI Fundamentals", "Creative AI", "Productivity"] as const;

export function getContentPillar(category?: string) {
  if (!category) return undefined;
  return contentPillars.find((item) => item.category.toLocaleLowerCase("vi") === category.toLocaleLowerCase("vi"));
}
