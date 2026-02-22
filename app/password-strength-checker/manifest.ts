import { Shield } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "password-strength-checker",
  slug: "password-strength-checker",
  title: "Password Strength Checker",
  description:
    "Check password strength with heuristic feedback on length, character variety, and common patterns.",
  category: "security-tokens",
  tags: ["password", "strength", "security", "validation", "heuristic"],
  icon: Shield,
  seo: {
    title: "Password Strength Checker | utilities.dev",
    description:
      "Check password strength in your browser. Heuristic feedback on length, complexity, and common patterns. Processing stays local.",
  },
  content: {
    intro:
      "Get heuristic feedback on password strength: length, character variety, and common weak patterns.",
    trustNote:
      "Analysis runs locally in your browser; passwords are never sent to a server. This tool provides heuristic guidance only, not a security guarantee.",
    howToSteps: [
      "Enter or paste a password into the input field.",
      "Review the strength score and feedback.",
      "Use the suggestions to improve weak passwords before use.",
    ],
    about:
      "This tool helps you evaluate password strength using common heuristics: length, character variety, and detection of weak patterns. It is useful during development or when crafting password policies. It does not guarantee security and cannot detect all weak or compromised passwords.",
    useCases: [
      "Testing password validation rules during auth implementation",
      "Getting quick feedback when choosing a new password",
      "Reviewing password policy requirements before deployment",
    ],
    faqs: [
      {
        question: "What does this tool check?",
        answer:
          "It checks length, use of uppercase, lowercase, numbers, and symbols, and flags common weak patterns like sequential characters or dictionary words. Results are heuristic only.",
      },
      {
        question: "Does this tool send my password anywhere?",
        answer:
          "No. All analysis runs locally in your browser. Your password never leaves your device.",
      },
      {
        question: "Can a strong score guarantee my password is secure?",
        answer:
          "No. Heuristic strength does not mean the password is unguessable or uncompromised. Use a password manager and enable 2FA for real security.",
      },
      {
        question: "Why does my password get a low score?",
        answer:
          "Short length, lack of character variety, or common patterns (sequences, repeated chars, dictionary words) lower the score. Try longer passwords with mixed character types.",
      },
    ],
  },
};

export default manifest;
