import { FooterSection } from "./footer-section"
import { TopNavBar } from "./top-nav-bar"
import { TranslationWorkbench } from "./translation-workbench"

export function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNavBar />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center px-4 py-4 md:px-10 md:py-6">
        <TranslationWorkbench />
      </main>
      <FooterSection />
    </div>
  )
}