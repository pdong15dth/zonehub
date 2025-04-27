"use client"

import { useState } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MoreHorizontal, 
  Search, 
  MapPin, 
  Plus, 
  Edit, 
  Trash, 
  Eye, 
  Map, 
  ListFilter 
} from "lucide-react"

// Mock data for zones
const zones = [
  {
    id: "1",
    name: "Quận 1",
    type: "urban",
    status: "active",
    createdAt: "15/03/2023",
    updatedAt: "15/03/2023",
    population: 180000,
    coordinates: {
      lat: 10.772844,
      lng: 106.698285
    },
    area: 7.8,
  },
  {
    id: "2",
    name: "Quận 2",
    type: "urban",
    status: "active",
    createdAt: "20/03/2023",
    updatedAt: "21/03/2023",
    population: 150000,
    coordinates: {
      lat: 10.786158,
      lng: 106.751328
    },
    area: 49.7,
  },
  {
    id: "3",
    name: "Quận 3",
    type: "urban",
    status: "active",
    createdAt: "25/03/2023",
    updatedAt: "26/03/2023",
    population: 190000,
    coordinates: {
      lat: 10.778969,
      lng: 106.682760
    },
    area: 4.9,
  },
  {
    id: "4",
    name: "Quận 4",
    type: "urban",
    status: "inactive",
    createdAt: "30/03/2023",
    updatedAt: "01/04/2023",
    population: 180000,
    coordinates: {
      lat: 10.759460,
      lng: 106.704747
    },
    area: 4.0,
  },
  {
    id: "5",
    name: "Huyện Cần Giờ",
    type: "rural",
    status: "active",
    createdAt: "05/04/2023",
    updatedAt: "06/04/2023",
    population: 70000,
    coordinates: {
      lat: 10.411944,
      lng: 106.955833
    },
    area: 704.0,
  },
]

export function ZoneManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedZone, setSelectedZone] = useState<typeof zones[0] | null>(null)

  // Filter zones based on search term and filters
  const filteredZones = zones.filter(zone => {
    const matchesSearch = zone.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || zone.type === typeFilter
    const matchesStatus = statusFilter === "all" || zone.status === statusFilter
    
    return matchesSearch && matchesType && matchesStatus
  })

  // Render status badge with appropriate color
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Hoạt động</Badge>
      case "inactive":
        return <Badge variant="outline" className="text-muted-foreground">Không hoạt động</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Render type badge with appropriate color
  const renderTypeBadge = (type: string) => {
    switch (type) {
      case "urban":
        return <Badge className="bg-blue-500">Thành thị</Badge>
      case "rural":
        return <Badge className="bg-amber-500">Nông thôn</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="list" className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm vùng..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <TabsList className="h-9">
              <TabsTrigger value="list" className="flex items-center gap-1">
                <ListFilter className="h-4 w-4" />
                <span>Danh sách</span>
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center gap-1">
                <Map className="h-4 w-4" />
                <span>Bản đồ</span>
              </TabsTrigger>
            </TabsList>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex gap-1 items-center ml-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Thêm vùng</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Thêm vùng mới</DialogTitle>
                  <DialogDescription>
                    Thêm vùng mới vào hệ thống và cấu hình thông tin.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="zone-name" className="text-right text-sm">
                      Tên vùng
                    </label>
                    <Input id="zone-name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="zone-type" className="text-right text-sm">
                      Loại vùng
                    </label>
                    <Select defaultValue="urban">
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Chọn loại vùng" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urban">Thành thị</SelectItem>
                        <SelectItem value="rural">Nông thôn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="zone-population" className="text-right text-sm">
                      Dân số
                    </label>
                    <Input id="zone-population" type="number" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="zone-area" className="text-right text-sm">
                      Diện tích (km²)
                    </label>
                    <Input id="zone-area" type="number" step="0.1" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="text-right text-sm">
                      Toạ độ
                    </span>
                    <div className="col-span-3 grid grid-cols-2 gap-2">
                      <Input placeholder="Vĩ độ (lat)" />
                      <Input placeholder="Kinh độ (lng)" />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="zone-status" className="text-right text-sm">
                      Trạng thái
                    </label>
                    <Select defaultValue="active">
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="inactive">Không hoạt động</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Tạo vùng</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="sm:w-[140px]">
              <SelectValue placeholder="Loại vùng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="urban">Thành thị</SelectItem>
              <SelectItem value="rural">Nông thôn</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="sm:w-[140px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Không hoạt động</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="list" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên vùng</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Dân số</TableHead>
                  <TableHead>Diện tích (km²)</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredZones.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      Không tìm thấy vùng nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredZones.map((zone) => (
                    <TableRow key={zone.id}>
                      <TableCell className="font-medium">{zone.name}</TableCell>
                      <TableCell>{renderTypeBadge(zone.type)}</TableCell>
                      <TableCell>{renderStatusBadge(zone.status)}</TableCell>
                      <TableCell>{zone.population.toLocaleString()}</TableCell>
                      <TableCell>{zone.area}</TableCell>
                      <TableCell>{zone.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Mở menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="flex gap-2 items-center"
                              onClick={() => setSelectedZone(zone)}
                            >
                              <Eye className="h-4 w-4" />
                              <span>Xem chi tiết</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex gap-2 items-center">
                              <Edit className="h-4 w-4" />
                              <span>Chỉnh sửa</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex gap-2 items-center text-destructive">
                              <Trash className="h-4 w-4" />
                              <span>Xóa vùng</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Hiển thị <strong>{filteredZones.length}</strong> trong số <strong>{zones.length}</strong> vùng
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm" disabled>
                Trước
              </Button>
              <Button variant="outline" size="sm">
                Sau
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <div className="border rounded-md">
            <div className="h-[500px] bg-muted relative flex items-center justify-center">
              <div className="absolute inset-0 p-2">
                {/* This would be replaced with an actual map component */}
                <div className="w-full h-full bg-background/40 rounded border border-dashed flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      Bản đồ tương tác sẽ được hiển thị tại đây
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tích hợp với Google Maps hoặc Mapbox
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Zone markers would be placed here */}
              {filteredZones.map(zone => (
                <div 
                  key={zone.id} 
                  className="absolute w-4 h-4 rounded-full bg-primary cursor-pointer"
                  style={{
                    // These are arbitrary positions for illustration
                    left: `${30 + parseInt(zone.id) * 10}%`,
                    top: `${40 + parseInt(zone.id) * 5}%`,
                  }}
                  onClick={() => setSelectedZone(zone)}
                  title={zone.name}
                />
              ))}
            </div>
          </div>

          {selectedZone && (
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">{selectedZone.name}</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedZone(null)}>
                  Đóng
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Loại vùng</p>
                  <p>{renderTypeBadge(selectedZone.type)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Trạng thái</p>
                  <p>{renderStatusBadge(selectedZone.status)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Dân số</p>
                  <p>{selectedZone.population.toLocaleString()} người</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Diện tích</p>
                  <p>{selectedZone.area} km²</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ngày tạo</p>
                  <p>{selectedZone.createdAt}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Cập nhật cuối</p>
                  <p>{selectedZone.updatedAt}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Toạ độ</p>
                  <p>Vĩ độ: {selectedZone.coordinates.lat}, Kinh độ: {selectedZone.coordinates.lng}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex gap-1 items-center">
                  <Edit className="h-4 w-4" />
                  <span>Chỉnh sửa</span>
                </Button>
                <Button variant="destructive" size="sm" className="flex gap-1 items-center">
                  <Trash className="h-4 w-4" />
                  <span>Xóa</span>
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 