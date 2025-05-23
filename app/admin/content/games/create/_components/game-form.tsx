"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import {
  Save,
  Loader2,
  Star,
  ImagePlus,
  Eye,
  FileText,
  Check,
  Trash,
  Plus,
} from "lucide-react"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { ImageUploadMultiple } from "@/components/ui/image-upload-multiple"
import { CKEditorField } from "@/components/ui/ckeditor"

// Map of hardware option values to display names
const valueMap: Record<string, string> = {
  // OS Values
  windows_11: "Windows 11 (64-bit)",
  windows_10: "Windows 10 (64-bit)",
  windows_8: "Windows 8.1 (64-bit)",
  windows_7: "Windows 7 (64-bit)",
  macos_14: "macOS 14 Sonoma",
  macos_13: "macOS 13 Ventura",
  macos_12: "macOS 12 Monterey",
  macos_11: "macOS 11 Big Sur",
  macos_10: "macOS 10.15 Catalina",
  linux_ubuntu: "Ubuntu 20.04+ LTS",
  linux_fedora: "Fedora 36+",
  linux_steam: "SteamOS 3.0+",

  // CPU Values
  intel_i3_13: "Intel Core i3-13100 3.4 GHz",
  intel_i3_12: "Intel Core i3-12100 3.3 GHz",
  intel_i3_10: "Intel Core i3-10100 3.6 GHz",
  intel_i3_9: "Intel Core i3-9100 3.6 GHz",
  intel_i5_14: "Intel Core i5-14400 2.5 GHz",
  intel_i5_13: "Intel Core i5-13400 2.5 GHz",
  intel_i5_12: "Intel Core i5-12400 2.5 GHz",
  intel_i5_11: "Intel Core i5-11400 2.6 GHz",
  intel_i5_10: "Intel Core i5-10400 2.9 GHz",
  intel_i5_9: "Intel Core i5-9400 2.9 GHz",
  intel_i7_14: "Intel Core i7-14700K 3.4 GHz",
  intel_i7_13: "Intel Core i7-13700K 3.4 GHz",
  intel_i7_12: "Intel Core i7-12700K 3.6 GHz",
  intel_i7_11: "Intel Core i7-11700K 3.6 GHz",
  intel_i7_10: "Intel Core i7-10700K 3.8 GHz",
  intel_i7_9: "Intel Core i7-9700K 3.6 GHz",
  intel_i9_14: "Intel Core i9-14900K 3.2 GHz",
  intel_i9_13: "Intel Core i9-13900K 3.0 GHz",
  intel_i9_12: "Intel Core i9-12900K 3.2 GHz",
  intel_i9_11: "Intel Core i9-11900K 3.5 GHz",
  intel_i9_10: "Intel Core i9-10900K 3.7 GHz",
  amd_ryzen3_5: "AMD Ryzen 3 5100 3.8 GHz",
  amd_ryzen3_4: "AMD Ryzen 3 4100 3.8 GHz",
  amd_ryzen3_3: "AMD Ryzen 3 3100 3.6 GHz",
  amd_ryzen5_7: "AMD Ryzen 5 7600X 4.7 GHz",
  amd_ryzen5_5: "AMD Ryzen 5 5600X 3.7 GHz",
  amd_ryzen5_4: "AMD Ryzen 5 4600G 3.7 GHz",
  amd_ryzen5_3: "AMD Ryzen 5 3600 3.6 GHz",
  amd_ryzen9_7950: "AMD Ryzen 9 7950X 4.5 GHz",
  amd_ryzen9_7: "AMD Ryzen 9 7900X 4.7 GHz",
  amd_ryzen9_5: "AMD Ryzen 9 5900X 3.7 GHz",
  amd_ryzen7_7: "AMD Ryzen 7 7700X 4.5 GHz",
  amd_ryzen7_5: "AMD Ryzen 7 5800X 3.8 GHz",
  amd_ryzen7_3: "AMD Ryzen 7 3700X 3.6 GHz",

  // RAM Values
  "4gb": "4 GB RAM",
  "8gb": "8 GB RAM",
  "12gb": "12 GB RAM",
  "16gb": "16 GB RAM",
  "24gb": "24 GB RAM",
  "32gb": "32 GB RAM",
  "64gb": "64 GB RAM",

  // GPU Values
  nvidia_gtx_1050: "NVIDIA GeForce GTX 1050 Ti 4GB",
  nvidia_gtx_1060: "NVIDIA GeForce GTX 1060 6GB",
  nvidia_gtx_1070: "NVIDIA GeForce GTX 1070 8GB",
  nvidia_gtx_1080: "NVIDIA GeForce GTX 1080 8GB",
  nvidia_gtx_1660: "NVIDIA GeForce GTX 1660 Super 6GB",
  nvidia_rtx_4090: "NVIDIA GeForce RTX 4090 24GB",
  nvidia_rtx_4080: "NVIDIA GeForce RTX 4080 16GB",
  nvidia_rtx_4070: "NVIDIA GeForce RTX 4070 12GB",
  nvidia_rtx_4060: "NVIDIA GeForce RTX 4060 8GB",
  nvidia_rtx_3090: "NVIDIA GeForce RTX 3090 24GB",
  nvidia_rtx_3080: "NVIDIA GeForce RTX 3080 10GB",
  nvidia_rtx_3070: "NVIDIA GeForce RTX 3070 8GB",
  nvidia_rtx_3060: "NVIDIA GeForce RTX 3060 12GB",
  nvidia_rtx_3050: "NVIDIA GeForce RTX 3050 8GB",
  nvidia_rtx_2080: "NVIDIA GeForce RTX 2080 8GB",
  nvidia_rtx_2070: "NVIDIA GeForce RTX 2070 8GB",
  nvidia_rtx_2060: "NVIDIA GeForce RTX 2060 6GB",
  amd_rx_7900xtx: "AMD Radeon RX 7900 XTX 24GB",
  amd_rx_7900xt: "AMD Radeon RX 7900 XT 20GB",
  amd_rx_7800xt: "AMD Radeon RX 7800 XT 16GB",
  amd_rx_7700xt: "AMD Radeon RX 7700 XT 12GB",
  amd_rx_7600: "AMD Radeon RX 7600 8GB",
  amd_rx_6900xt: "AMD Radeon RX 6900 XT 16GB",
  amd_rx_6800xt: "AMD Radeon RX 6800 XT 16GB",
  amd_rx_6700xt: "AMD Radeon RX 6700 XT 12GB",
  amd_rx_6600xt: "AMD Radeon RX 6600 XT 8GB",
  amd_rx_6500xt: "AMD Radeon RX 6500 XT 4GB",
  amd_rx_5700xt: "AMD Radeon RX 5700 XT 8GB",
  amd_rx_5600xt: "AMD Radeon RX 5600 XT 6GB",
  amd_rx_5500xt: "AMD Radeon RX 5500 XT 8GB",
  amd_rx_590: "AMD Radeon RX 590 8GB",
  amd_rx_580: "AMD Radeon RX 580 8GB",
  amd_rx_570: "AMD Radeon RX 570 4GB",
  intel_arc_a770: "Intel Arc A770 16GB",
  intel_arc_a750: "Intel Arc A750 8GB",
  intel_arc_a380: "Intel Arc A380 6GB",
  intel_iris_xe: "Intel Iris Xe Graphics",
  intel_uhd_730: "Intel UHD Graphics 730",
  intel_hd_630: "Intel HD Graphics 630",

  // Storage Values
  "20gb": "20 GB",
  "30gb": "30 GB",
  "50gb": "50 GB",
  "70gb": "70 GB",
  "100gb": "100 GB",
  "150gb": "150 GB",
  "200gb": "200 GB SSD",
  "250gb": "250 GB SSD",
  "300gb": "300 GB SSD",
  "500gb": "500 GB SSD",
};

// Helper functions for system requirements
const parseSystemRequirements = (requirementsString: string | null) => {
  if (!requirementsString) return {}

  try {
    // Kiểm tra xem đã là JSON chưa
    if (requirementsString.startsWith('{') && requirementsString.endsWith('}')) {
      return JSON.parse(requirementsString)
    }

    // Nếu không phải JSON, xem như additional text
    return { additional: requirementsString }
  } catch {
    return { additional: requirementsString }
  }
}

const updateSystemRequirements = (currentRequirements: string | null, field: string, value: string) => {
  const requirements = parseSystemRequirements(currentRequirements)
  requirements[field] = value
  return JSON.stringify(requirements)
}

const updatePlatformRequirements = (currentRequirements: string | null, platform: string, data: any) => {
  const requirements = parseSystemRequirements(currentRequirements)
  requirements[platform] = { ...requirements[platform], ...data }
  return JSON.stringify(requirements)
}

const getPlatformRequirements = (requirementsString: string | null, platform: string) => {
  const requirements = parseSystemRequirements(requirementsString)
  return requirements[platform] || {}
}

const getAdditionalRequirements = (requirementsString: string | null) => {
  const requirements = parseSystemRequirements(requirementsString)
  return requirements.additional || ''
}

// Helper functions for system requirements display
const getPlatformLabel = (platform: string) => {
  const platformMap: Record<string, string> = {
    pc: "PC",
    mac: "Mac",
    linux: "Linux",
    android: "Android",
    ios: "iOS",
    windows: "Windows"
  }
  return platformMap[platform] || platform
}

const getSpecLabel = (spec: string, platform: string) => {
  // PC spec labels
  if (platform === 'pc' || platform === 'windows' || platform === 'mac' || platform === 'linux') {
    const specMap: Record<string, string> = {
      os: "Hệ điều hành",
      processor: "Bộ xử lý",
      memory: "Bộ nhớ",
      graphics: "Card đồ họa",
      storage: "Dung lượng lưu trữ",
      directx: "DirectX",
      network: "Kết nối mạng"
    }
    return specMap[spec] || spec
  }

  // Mobile spec labels
  if (platform === 'android' || platform === 'ios') {
    const specMap: Record<string, string> = {
      os: "Phiên bản OS",
      processor: "Bộ xử lý",
      memory: "Bộ nhớ RAM",
      storage: "Dung lượng lưu trữ",
      screen: "Màn hình",
      network: "Kết nối mạng",
      device: "Thiết bị"
    }
    return specMap[spec] || spec
  }

  return spec
}

const getSystemRequirementsDisplay = (requirementsString: string | null) => {
  const requirements = parseSystemRequirements(requirementsString)

  // Nếu không có dữ liệu được cấu trúc
  if (Object.keys(requirements).length === 0 || (Object.keys(requirements).length === 1 && requirements.additional)) {
    return requirementsString || ''
  }

  let html = ''

  // Xử lý từng nền tảng
  const platforms = Object.keys(requirements).filter(key =>
    key !== 'additional' && typeof requirements[key] === 'object'
  )

  platforms.forEach(platform => {
    const platformData = requirements[platform]
    const platformLabel = getPlatformLabel(platform)

    html += `<h3 class="font-bold text-base mb-2">Yêu cầu hệ thống cho ${platformLabel}:</h3>`

    // Yêu cầu tối thiểu
    if (platformData.min) {
      html += '<h4 class="font-medium text-sm mb-2 ml-2">Yêu cầu tối thiểu:</h4><ul class="list-disc pl-7 mb-4">'
      Object.entries(platformData.min).forEach(([key, value]) => {
        if (key !== 'custom') {
          const label = getSpecLabel(key, platform)
          html += `<li>${label}: ${value}</li>`
        }
      })

      // Custom fields
      if (platformData.min.custom) {
        Object.entries(platformData.min.custom).forEach(([key, value]) => {
          html += `<li>${key}: ${value}</li>`
        })
      }
      html += '</ul>'
    }

    // Yêu cầu đề xuất
    if (platformData.rec) {
      html += '<h4 class="font-medium text-sm mb-2 ml-2">Yêu cầu đề xuất:</h4><ul class="list-disc pl-7 mb-4">'
      Object.entries(platformData.rec).forEach(([key, value]) => {
        if (key !== 'custom') {
          const label = getSpecLabel(key, platform)
          html += `<li>${label}: ${value}</li>`
        }
      })

      // Custom fields
      if (platformData.rec.custom) {
        Object.entries(platformData.rec.custom).forEach(([key, value]) => {
          html += `<li>${key}: ${value}</li>`
        })
      }
      html += '</ul>'
    }
  })

  // Thông tin bổ sung
  if (requirements.additional) {
    html += '<h3 class="font-bold text-base mb-2">Thông tin bổ sung:</h3>'
    html += `<p>${requirements.additional}</p>`
  }

  return html
}

interface MultiSelectProps {
  options: { value: string, label: string }[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder: string
}

// MultiSelect component for platforms and genres
const MultiSelect = ({ options, selected, onChange, placeholder }: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(item => item !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <div className="relative">
      <div
        className="flex flex-wrap gap-1 p-2 border rounded-md cursor-pointer min-h-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected.length === 0 && (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        {selected.map(item => {
          const option = options.find(opt => opt.value === item)
          return (
            <Badge key={item} variant="secondary" className="flex items-center gap-1">
              {option?.label || item}
              <button
                className="ml-1 rounded-full hover:bg-muted p-0.5"
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelect(item)
                }}
                aria-label={`Remove ${option?.label || item}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </Badge>
          )
        })}
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-popover border rounded-md shadow-md p-1">
          {options.map(option => (
            <div
              key={option.value}
              className={`flex items-center gap-2 p-2 hover:bg-muted rounded-sm cursor-pointer ${selected.includes(option.value) ? 'bg-muted' : ''
                }`}
              onClick={() => handleSelect(option.value)}
            >
              <Checkbox checked={selected.includes(option.value)} />
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface PlatformRequirementButtonProps {
  platform: string
  label: string
  currentRequirements: string
  onAdd: (platform: string) => void
}

const PlatformRequirementButton = ({ platform, label, currentRequirements, onAdd }: PlatformRequirementButtonProps) => {
  const requirements = parseSystemRequirements(currentRequirements)
  const isAdded = !!requirements[platform]

  return (
    <Button
      type="button"
      variant={isAdded ? "secondary" : "outline"}
      size="sm"
      onClick={() => onAdd(platform)}
      disabled={isAdded}
      className="text-xs"
    >
      {label}
      {isAdded && <Check className="ml-1 h-3 w-3" />}
    </Button>
  )
}

interface PlatformRequirementFormProps {
  platform: string
  requirements: any
  onChange: (data: any) => void
  onRemove: () => void
}

const PlatformRequirementForm = ({ platform, requirements, onChange, onRemove }: PlatformRequirementFormProps) => {
  const [customFields, setCustomFields] = useState({
    min: Object.keys(requirements.min?.custom || {}).map(key => ({ name: key, value: requirements.min?.custom?.[key] || '' })),
    rec: Object.keys(requirements.rec?.custom || {}).map(key => ({ name: key, value: requirements.rec?.custom?.[key] || '' }))
  })

  const handleCustomFieldChange = (reqType: 'min' | 'rec', index: number, field: 'name' | 'value', value: string) => {
    const newFields = [...customFields[reqType]]
    newFields[index] = { ...newFields[index], [field]: value }
    setCustomFields({ ...customFields, [reqType]: newFields })

    // Update custom fields in the requirements
    const customData: Record<string, string> = {}
    newFields.forEach(field => {
      if (field.name && field.value) {
        customData[field.name] = field.value
      }
    })

    const newReqData = {
      ...requirements,
      [reqType]: {
        ...requirements[reqType],
        custom: Object.keys(customData).length > 0 ? customData : undefined
      }
    }

    onChange(newReqData)
  }

  const addCustomField = (reqType: 'min' | 'rec') => {
    setCustomFields({
      ...customFields,
      [reqType]: [...customFields[reqType], { name: '', value: '' }]
    })
  }

  const removeCustomField = (reqType: 'min' | 'rec', index: number) => {
    const newFields = customFields[reqType].filter((_, i) => i !== index)
    setCustomFields({ ...customFields, [reqType]: newFields })

    // Update custom fields in the requirements
    const customData: Record<string, string> = {}
    newFields.forEach(field => {
      if (field.name && field.value) {
        customData[field.name] = field.value
      }
    })

    const newReqData = {
      ...requirements,
      [reqType]: {
        ...requirements[reqType],
        custom: Object.keys(customData).length > 0 ? customData : undefined
      }
    }

    onChange(newReqData)
  }

  // Get platform specific fields
  const getFields = (platform: string) => {
    if (platform === 'android' || platform === 'ios') {
      return [
        { key: 'os', label: 'Phiên bản OS' },
        { key: 'processor', label: 'Bộ xử lý' },
        { key: 'memory', label: 'Bộ nhớ RAM' },
        { key: 'storage', label: 'Dung lượng lưu trữ' },
        { key: 'screen', label: 'Màn hình' },
      ]
    }

    return [
      { key: 'os', label: 'Hệ điều hành' },
      { key: 'processor', label: 'Bộ xử lý' },
      { key: 'memory', label: 'Bộ nhớ' },
      { key: 'graphics', label: 'Card đồ họa' },
      { key: 'storage', label: 'Dung lượng lưu trữ' },
      { key: 'directx', label: 'DirectX' },
      { key: 'network', label: 'Kết nối mạng' },
    ]
  }

  return (
    <div className="border rounded-md p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">{getPlatformLabel(platform)}</h3>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
          <Trash className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      {/* Minimum Requirements */}
      <div>
        <h4 className="text-sm font-medium mb-3">Yêu cầu tối thiểu</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getFields(platform).map(field => (
            <div key={`min-${field.key}`} className="space-y-2">
              <Label htmlFor={`min-${field.key}-${platform}`}>{field.label}</Label>
              <Input
                id={`min-${field.key}-${platform}`}
                value={requirements.min?.[field.key] || ''}
                onChange={(e) => {
                  const newReqData = {
                    ...requirements,
                    min: { ...requirements.min, [field.key]: e.target.value }
                  }
                  onChange(newReqData)
                }}
                placeholder={`${field.label}...`}
                className="h-9"
              />
            </div>
          ))}
        </div>

        {/* Custom fields */}
        {customFields.min.map((field, index) => (
          <div key={`min-custom-${index}`} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor={`min-custom-name-${index}`}>Tên trường</Label>
              <Input
                id={`min-custom-name-${index}`}
                value={field.name}
                onChange={(e) => handleCustomFieldChange('min', index, 'name', e.target.value)}
                placeholder="Tên trường tùy chỉnh..."
                className="h-9"
              />
            </div>
            <div className="space-y-2 flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor={`min-custom-value-${index}`}>Giá trị</Label>
                <Input
                  id={`min-custom-value-${index}`}
                  value={field.value}
                  onChange={(e) => handleCustomFieldChange('min', index, 'value', e.target.value)}
                  placeholder="Giá trị trường..."
                  className="h-9"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeCustomField('min', index)}
                className="h-9 w-9"
              >
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addCustomField('min')}
          className="mt-4"
        >
          <Plus className="h-4 w-4 mr-1" /> Thêm trường tùy chỉnh
        </Button>
      </div>

      <Separator />

      {/* Recommended Requirements */}
      <div>
        <h4 className="text-sm font-medium mb-3">Yêu cầu đề xuất</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getFields(platform).map(field => (
            <div key={`rec-${field.key}`} className="space-y-2">
              <Label htmlFor={`rec-${field.key}-${platform}`}>{field.label}</Label>
              <Input
                id={`rec-${field.key}-${platform}`}
                value={requirements.rec?.[field.key] || ''}
                onChange={(e) => {
                  const newReqData = {
                    ...requirements,
                    rec: { ...requirements.rec, [field.key]: e.target.value }
                  }
                  onChange(newReqData)
                }}
                placeholder={`${field.label}...`}
                className="h-9"
              />
            </div>
          ))}
        </div>

        {/* Custom fields */}
        {customFields.rec.map((field, index) => (
          <div key={`rec-custom-${index}`} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor={`rec-custom-name-${index}`}>Tên trường</Label>
              <Input
                id={`rec-custom-name-${index}`}
                value={field.name}
                onChange={(e) => handleCustomFieldChange('rec', index, 'name', e.target.value)}
                placeholder="Tên trường tùy chỉnh..."
                className="h-9"
              />
            </div>
            <div className="space-y-2 flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor={`rec-custom-value-${index}`}>Giá trị</Label>
                <Input
                  id={`rec-custom-value-${index}`}
                  value={field.value}
                  onChange={(e) => handleCustomFieldChange('rec', index, 'value', e.target.value)}
                  placeholder="Giá trị trường..."
                  className="h-9"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeCustomField('rec', index)}
                className="h-9 w-9"
              >
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addCustomField('rec')}
          className="mt-4"
        >
          <Plus className="h-4 w-4 mr-1" /> Thêm trường tùy chỉnh
        </Button>
      </div>
    </div>
  )
}

// Định nghĩa kiểu dữ liệu GameImage
interface GameImage {
  id?: string;
  url: string;
  caption?: string | null;
  is_primary?: boolean;
  display_order?: number;
}

export function GameForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("edit")
  const [viewTab, setViewTab] = useState("basic")

  const [game, setGame] = useState({
    title: initialData?.title || '',
    developer: initialData?.developer || '',
    publisher: initialData?.publisher || '',
    release_date: initialData?.release_date || new Date().toLocaleDateString('en-GB'),
    description: initialData?.description || '',
    content: initialData?.content || '',
    system_requirements: initialData?.system_requirements || '',
    trailer_url: initialData?.trailer_url || '',
    official_website: initialData?.official_website || '',
    platform: initialData?.platform || [] as string[],
    genre: initialData?.genre || [] as string[],
    rating: initialData?.rating || 0,
    downloads: initialData?.downloads || 0,
    status: initialData?.status || 'draft' as 'draft' | 'published',
    featured: initialData?.featured || false,
    image: initialData?.image || '/placeholder.svg',
    images: initialData?.images || [] as string[],
    gameImages: initialData?.gameImages || [] as Array<{
      id?: string;
      url: string;
      caption?: string | null;
      is_primary?: boolean;
      display_order?: number;
    }>,
  })

  const platformOptions = [
    { value: 'ps5', label: 'PlayStation 5' },
    { value: 'ps4', label: 'PlayStation 4' },
    { value: 'xboxsx', label: 'Xbox Series X/S' },
    { value: 'xboxone', label: 'Xbox One' },
    { value: 'pc', label: 'PC' },
    { value: 'switch', label: 'Nintendo Switch' },
    { value: 'mobile', label: 'Mobile' },
  ]

  const genreOptions = [
    { value: 'action', label: 'Hành động' },
    { value: 'adventure', label: 'Phiêu lưu' },
    { value: 'rpg', label: 'Nhập vai' },
    { value: 'shooter', label: 'Bắn súng' },
    { value: 'strategy', label: 'Chiến thuật' },
    { value: 'puzzle', label: 'Giải đố' },
    { value: 'simulation', label: 'Mô phỏng' },
    { value: 'sports', label: 'Thể thao' },
    { value: 'racing', label: 'Đua xe' },
    { value: 'horror', label: 'Kinh dị' },
  ]

  const handleChange = (field: string, value: any) => {
    setGame(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const requiredFields = ['title', 'developer', 'publisher', 'release_date']
    const missingFields = requiredFields.filter(field => !game[field as keyof typeof game])

    if (missingFields.length > 0) {
      toast({
        title: "Lỗi",
        description: `Vui lòng điền đầy đủ thông tin: ${missingFields.join(', ')}`,
        variant: "destructive",
        duration: 3000,
      })
      return false
    }

    if (!game.platform || game.platform.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ít nhất một nền tảng",
        variant: "destructive",
        duration: 3000,
      })
      return false
    }

    if (!game.genre || game.genre.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ít nhất một thể loại",
        variant: "destructive",
        duration: 3000,
      })
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      setIsSaving(true)
      const supabase = createBrowserSupabaseClient()

      // Get current user info for created_by/updated_by
      const { data: { user } } = await supabase.auth.getUser()

      if (initialData?.id) {
        // Update existing game
        const { error } = await supabase
          .from('games')
          .update({
            ...game,
            updated_by: user?.id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', initialData.id)

        if (error) throw error

        toast({
          title: "Thành công",
          description: `Game "${game.title}" đã được cập nhật thành công`,
          duration: 3000,
        })
      } else {
        // Create new game
        const { error } = await supabase
          .from('games')
          .insert({
            ...game,
            created_by: user?.id,
            author_id: user?.id,
            created_at: new Date().toISOString(),
          })

        if (error) throw error

        toast({
          title: "Thành công",
          description: `Game "${game.title}" đã được tạo thành công`,
          duration: 3000,
        })
      }

      // Redirect to the games list
      router.push('/admin/content/games')
    } catch (err: any) {
      console.error('Error saving game:', err)
      toast({
        title: "Lỗi",
        description: `Không thể ${initialData?.id ? 'cập nhật' : 'tạo'} game: ${err.message || "Đã xảy ra lỗi không xác định"}`,
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Chuyển đổi game.images thành gameImages khi chỉ có mảng URL
  useEffect(() => {
    if (initialData?.images?.length && (!initialData?.gameImages || initialData?.gameImages.length === 0)) {
      // Nếu có images nhưng không có gameImages, tạo gameImages từ images
      const gameImages = initialData.images.map((url: string, index: number) => ({
        url,
        is_primary: index === 0 || url === initialData.image,
        display_order: index,
        caption: null
      }));

      setGame(prev => ({
        ...prev,
        gameImages
      }));
    }
  }, [initialData]);

  const handleImageChange = (newImages: GameImage[]) => {
    // Tìm ảnh đại diện chính
    const primaryImageUrl = newImages.length > 0
      ? (newImages.find((i: GameImage) => i.is_primary)?.url || newImages[0].url)
      : '/placeholder.svg';

    // Tạo mảng URLs
    const imageUrls: string[] = [];
    for (const img of newImages) {
      imageUrls.push(img.url);
    }

    // Cập nhật state
    setGame(prev => ({
      ...prev,
      gameImages: newImages,
      image: primaryImageUrl,
      images: imageUrls
    }));
  };

  // Render game preview in preview tab
  const renderPreview = () => {
    const getPlatformLabel = (value: string) => {
      const option = platformOptions.find(opt => opt.value === value)
      return option?.label || value
    }

    const getGenreLabel = (value: string) => {
      const option = genreOptions.find(opt => opt.value === value)
      return option?.label || value
    }

    return (
      <div className="space-y-8">
        {/* Cover image */}
        <div className="aspect-video w-full max-h-[400px] rounded-xl overflow-hidden bg-muted">
          {game.gameImages && game.gameImages.length > 0 ? (
            <img
              src={game.gameImages.find((img: GameImage) => img.is_primary)?.url || game.gameImages[0].url}
              alt={game.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={game.image || '/placeholder.svg'}
              alt={game.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Game info header */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {game.platform.map((p: string) => (
              <Badge key={p} variant="secondary">
                {getPlatformLabel(p)}
              </Badge>
            ))}
            {game.featured && (
              <Badge variant="default" className="bg-amber-500">
                Game nổi bật
              </Badge>
            )}
            <Badge variant="outline">
              {game.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
            </Badge>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">{game.title || 'Tên game'}</h1>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Phát triển bởi: <strong>{game.developer || 'Chưa có'}</strong></span>
            <span>•</span>
            <span>Phát hành bởi: <strong>{game.publisher || 'Chưa có'}</strong></span>
            <span>•</span>
            <span>Ngày phát hành: <strong>{game.release_date || 'Chưa xác định'}</strong></span>
          </div>

          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
            <span className="font-medium">{game.rating}</span>
            <span className="text-muted-foreground">({game.downloads} lượt tải)</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {game.genre.map((g: string) => (
              <Badge key={g} variant="outline" className="bg-primary/10">
                {getGenreLabel(g)}
              </Badge>
            ))}
          </div>

          <p className="text-muted-foreground border-t pt-4">
            {game.description || 'Chưa có mô tả'}
          </p>
        </div>

        {/* Nội dung chi tiết */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Nội dung chi tiết</h2>
          <div className="prose prose-sm max-w-none">
            {game.content ? (
              <div dangerouslySetInnerHTML={{ __html: game.content }} />
            ) : (
              <p className="text-muted-foreground">Chưa có nội dung chi tiết</p>
            )}
          </div>
        </div>

        {/* Yêu cầu hệ thống */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Yêu cầu hệ thống</h2>
          <div className="prose prose-sm max-w-none">
            {game.system_requirements ? (
              <div dangerouslySetInnerHTML={{ __html: getSystemRequirementsDisplay(game.system_requirements) }} />
            ) : (
              <p className="text-muted-foreground">Chưa có thông tin yêu cầu hệ thống</p>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Liên kết</h2>
          <div className="space-y-2">
            {game.trailer_url && (
              <div>
                <span className="font-medium">Trailer:</span>{' '}
                <a href={game.trailer_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {game.trailer_url}
                </a>
              </div>
            )}
            {game.official_website && (
              <div>
                <span className="font-medium">Website chính thức:</span>{' '}
                <a href={game.official_website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {game.official_website}
                </a>
              </div>
            )}
            {!game.trailer_url && !game.official_website && (
              <p className="text-muted-foreground">Chưa có liên kết nào</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Chỉnh sửa</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>Xem trước</span>
              </TabsTrigger>
            </TabsList>

            <Button
              onClick={handleSubmit}
              disabled={isSaving}
              className="gap-1"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {initialData?.id ? 'Cập nhật' : 'Lưu'}
                </>
              )}
            </Button>
          </div>

          <TabsContent value="edit">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
                    <CardDescription>Thông tin chung về game</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Tên game <span className="text-destructive">*</span></Label>
                        <Input
                          id="title"
                          value={game.title}
                          onChange={(e) => handleChange('title', e.target.value)}
                          placeholder="Nhập tên game..."
                          className="h-10"
                        />
                        <p className="text-xs text-muted-foreground">
                          Tên đầy đủ của game
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="release_date">Ngày phát hành <span className="text-destructive">*</span></Label>
                        <Input
                          id="release_date"
                          value={game.release_date}
                          onChange={(e) => handleChange('release_date', e.target.value)}
                          placeholder="DD/MM/YYYY"
                          className="h-10"
                        />
                        <p className="text-xs text-muted-foreground">
                          Định dạng: DD/MM/YYYY
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="developer">Nhà phát triển <span className="text-destructive">*</span></Label>
                        <Input
                          id="developer"
                          value={game.developer}
                          onChange={(e) => handleChange('developer', e.target.value)}
                          placeholder="Nhập tên nhà phát triển..."
                          className="h-10"
                        />
                        <p className="text-xs text-muted-foreground">
                          Studio hoặc công ty phát triển game
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="publisher">Nhà phát hành <span className="text-destructive">*</span></Label>
                        <Input
                          id="publisher"
                          value={game.publisher}
                          onChange={(e) => handleChange('publisher', e.target.value)}
                          placeholder="Nhập tên nhà phát hành..."
                          className="h-10"
                        />
                        <p className="text-xs text-muted-foreground">
                          Công ty phát hành game
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="description">Mô tả</Label>
                      <Textarea
                        id="description"
                        value={game.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Nhập mô tả ngắn gọn về game..."
                        rows={4}
                        className="resize-none min-h-24"
                      />
                      <p className="text-xs text-muted-foreground">
                        Mô tả ngắn gọn về game, được hiển thị ở trang danh sách
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="content">Nội dung chi tiết</Label>
                      <CKEditorField
                        value={game.content}
                        onChange={(value) => handleChange('content', value)}
                        placeholder="Nhập nội dung chi tiết về game..."
                        minHeight="400px"
                      />
                      <p className="text-xs text-muted-foreground">
                        Mô tả chi tiết, thông tin gameplay, câu chuyện, tính năng,...
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="system_requirements">Yêu cầu hệ thống</Label>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="border rounded-md p-4 space-y-4">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-medium">Thêm yêu cầu hệ thống cho nền tảng</h4>
                            <div className="flex gap-2">
                              <PlatformRequirementButton
                                platform="windows"
                                label="Windows"
                                currentRequirements={game.system_requirements}
                                onAdd={(platform) => {
                                  // Only add if not already present
                                  const reqs = parseSystemRequirements(game.system_requirements)
                                  if (!reqs[platform]) {
                                    const newReqs = updatePlatformRequirements(
                                      game.system_requirements,
                                      platform,
                                      { min: {}, rec: {} }
                                    )
                                    handleChange('system_requirements', newReqs)
                                  }
                                }}
                              />
                              <PlatformRequirementButton
                                platform="mac"
                                label="Mac"
                                currentRequirements={game.system_requirements}
                                onAdd={(platform) => {
                                  const reqs = parseSystemRequirements(game.system_requirements)
                                  if (!reqs[platform]) {
                                    const newReqs = updatePlatformRequirements(
                                      game.system_requirements,
                                      platform,
                                      { min: {}, rec: {} }
                                    )
                                    handleChange('system_requirements', newReqs)
                                  }
                                }}
                              />
                              <PlatformRequirementButton
                                platform="linux"
                                label="Linux"
                                currentRequirements={game.system_requirements}
                                onAdd={(platform) => {
                                  const reqs = parseSystemRequirements(game.system_requirements)
                                  if (!reqs[platform]) {
                                    const newReqs = updatePlatformRequirements(
                                      game.system_requirements,
                                      platform,
                                      { min: {}, rec: {} }
                                    )
                                    handleChange('system_requirements', newReqs)
                                  }
                                }}
                              />
                              <PlatformRequirementButton
                                platform="android"
                                label="Android"
                                currentRequirements={game.system_requirements}
                                onAdd={(platform) => {
                                  const reqs = parseSystemRequirements(game.system_requirements)
                                  if (!reqs[platform]) {
                                    const newReqs = updatePlatformRequirements(
                                      game.system_requirements,
                                      platform,
                                      { min: {}, rec: {} }
                                    )
                                    handleChange('system_requirements', newReqs)
                                  }
                                }}
                              />
                              <PlatformRequirementButton
                                platform="ios"
                                label="iOS"
                                currentRequirements={game.system_requirements}
                                onAdd={(platform) => {
                                  const reqs = parseSystemRequirements(game.system_requirements)
                                  if (!reqs[platform]) {
                                    const newReqs = updatePlatformRequirements(
                                      game.system_requirements,
                                      platform,
                                      { min: {}, rec: {} }
                                    )
                                    handleChange('system_requirements', newReqs)
                                  }
                                }}
                              />
                            </div>
                          </div>

                          {/* Platform requirement forms */}
                          {Object.keys(parseSystemRequirements(game.system_requirements))
                            .filter(key => key !== 'additional' && typeof parseSystemRequirements(game.system_requirements)[key] === 'object')
                            .map(platform => (
                              <PlatformRequirementForm
                                key={platform}
                                platform={platform}
                                requirements={getPlatformRequirements(game.system_requirements, platform)}
                                onChange={(data) => {
                                  const newReqs = updatePlatformRequirements(
                                    game.system_requirements,
                                    platform,
                                    data
                                  )
                                  handleChange('system_requirements', newReqs)
                                }}
                                onRemove={() => {
                                  const reqs = parseSystemRequirements(game.system_requirements)
                                  delete reqs[platform]
                                  handleChange('system_requirements', JSON.stringify(reqs))
                                }}
                              />
                            ))}

                          <div>
                            <Label htmlFor="system_requirements_additional">Thông tin bổ sung</Label>
                            <Textarea
                              id="system_requirements_additional"
                              value={getAdditionalRequirements(game.system_requirements)}
                              onChange={(e) => {
                                const newRequirements = updateSystemRequirements(game.system_requirements, 'additional', e.target.value);
                                handleChange('system_requirements', newRequirements);
                              }}
                              placeholder="Các yêu cầu bổ sung khác..."
                              className="resize-none min-h-[100px]"
                            />
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Yêu cầu tối thiểu và đề xuất để chơi game
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Additional Info */}
              <div>
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Ảnh bìa</CardTitle>
                      <CardDescription>Hình ảnh đại diện cho game</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ImageUploadMultiple
                        images={game.gameImages}
                        onChange={handleImageChange}
                        maxImages={10}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Phân loại</CardTitle>
                      <CardDescription>Thông tin phân loại game</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>Nền tảng <span className="text-destructive">*</span></Label>
                        <MultiSelect
                          options={platformOptions}
                          selected={game.platform}
                          onChange={(selected) => handleChange('platform', selected)}
                          placeholder="Chọn nền tảng..."
                        />
                        <p className="text-xs text-muted-foreground">
                          Các nền tảng hỗ trợ chơi game
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Thể loại <span className="text-destructive">*</span></Label>
                        <MultiSelect
                          options={genreOptions}
                          selected={game.genre}
                          onChange={(selected) => handleChange('genre', selected)}
                          placeholder="Chọn thể loại..."
                        />
                        <p className="text-xs text-muted-foreground">
                          Phân loại game theo thể loại
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Thông tin bổ sung</CardTitle>
                      <CardDescription>Các thông tin khác của game</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="trailer_url">Link trailer</Label>
                          <Input
                            id="trailer_url"
                            value={game.trailer_url}
                            onChange={(e) => handleChange('trailer_url', e.target.value)}
                            placeholder="Nhập URL trailer (YouTube)..."
                            className="h-10"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="official_website">Website chính thức</Label>
                          <Input
                            id="official_website"
                            value={game.official_website}
                            onChange={(e) => handleChange('official_website', e.target.value)}
                            placeholder="Nhập URL website chính thức..."
                            className="h-10"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="rating">Đánh giá</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="rating"
                                type="number"
                                min="0"
                                max="5"
                                step="0.1"
                                value={game.rating}
                                onChange={(e) => handleChange('rating', parseFloat(e.target.value))}
                                className="h-10"
                              />
                              <Star className="h-4 w-4 text-yellow-500" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="downloads">Lượt tải</Label>
                            <Input
                              id="downloads"
                              type="number"
                              min="0"
                              value={game.downloads}
                              onChange={(e) => handleChange('downloads', parseInt(e.target.value))}
                              className="h-10"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Trạng thái</CardTitle>
                      <CardDescription>Cài đặt trạng thái hiển thị</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="featured"
                          checked={game.featured}
                          onCheckedChange={(checked) => handleChange('featured', !!checked)}
                        />
                        <Label htmlFor="featured">Đánh dấu là game nổi bật</Label>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label htmlFor="status">Trạng thái xuất bản</Label>
                        <Select
                          value={game.status}
                          onValueChange={(value: 'draft' | 'published') => handleChange('status', value)}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Bản nháp</SelectItem>
                            <SelectItem value="published">Đã xuất bản</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-2">
                          Game ở trạng thái "Đã xuất bản" sẽ hiển thị cho người dùng. Game ở trạng thái "Bản nháp" chỉ hiển thị cho quản trị viên.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-8">
            {renderPreview()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 