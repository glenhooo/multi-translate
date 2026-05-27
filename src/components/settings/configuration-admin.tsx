import * as React from "react"
import { ArrowUpDown, Download, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"

type ConfigurationAdminProps = {
  onExport: () => void
  onImportFile: (file: File) => void | Promise<void>
}

export function ConfigurationAdmin({
  onExport,
  onImportFile,
}: ConfigurationAdminProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  function handleImportChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) {
      return
    }

    void onImportFile(file)
  }

  return (
    <section id="administration" className="flex flex-col gap-4 md:mt-6">
      <div className="border-b border-border pb-3">
        <h2 className="text-xl font-semibold tracking-tight">
          管理 (Administration)
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          导入或导出您的所有设置和提供商配置。
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-xs md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ArrowUpDown className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-medium">配置同步</h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              将当前所有提供商和偏好设置导出为 JSON 文件，或从本地文件导入覆盖当前配置。
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleImportChange}
        />
        <div className="flex flex-col gap-2 sm:flex-row md:shrink-0">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="size-4" />
            导入配置
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={onExport}
          >
            <Download className="size-4" />
            导出配置
          </Button>
        </div>
      </div>
    </section>
  )
}
