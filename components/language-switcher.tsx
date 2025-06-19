"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { Languages } from "lucide-react"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-2">
      <Languages className="h-4 w-4 text-gray-600" />
      <div className="flex rounded-md border">
        <Button
          variant={language === "ko" ? "default" : "ghost"}
          size="sm"
          onClick={() => setLanguage("ko")}
          className="rounded-r-none"
        >
          한국어
        </Button>
        <Button
          variant={language === "en" ? "default" : "ghost"}
          size="sm"
          onClick={() => setLanguage("en")}
          className="rounded-l-none"
        >
          English
        </Button>
      </div>
    </div>
  )
}
