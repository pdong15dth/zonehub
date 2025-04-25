"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

export function GameFilters() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Filters</h3>
        <Accordion type="multiple" defaultValue={["platforms", "genres", "rating"]}>
          <AccordionItem value="platforms">
            <AccordionTrigger>Platforms</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="pc" />
                  <Label htmlFor="pc">PC</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="playstation" />
                  <Label htmlFor="playstation">PlayStation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="xbox" />
                  <Label htmlFor="xbox">Xbox</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="switch" />
                  <Label htmlFor="switch">Nintendo Switch</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="mobile" />
                  <Label htmlFor="mobile">Mobile</Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="genres">
            <AccordionTrigger>Genres</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="action" />
                  <Label htmlFor="action">Action</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="adventure" />
                  <Label htmlFor="adventure">Adventure</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="rpg" />
                  <Label htmlFor="rpg">RPG</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="strategy" />
                  <Label htmlFor="strategy">Strategy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="simulation" />
                  <Label htmlFor="simulation">Simulation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sports" />
                  <Label htmlFor="sports">Sports</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="racing" />
                  <Label htmlFor="racing">Racing</Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="rating">
            <AccordionTrigger>Rating</AccordionTrigger>
            <AccordionContent>
              <RadioGroup defaultValue="all">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all">All Ratings</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4plus" id="4plus" />
                  <Label htmlFor="4plus">4+ Stars</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3plus" id="3plus" />
                  <Label htmlFor="3plus">3+ Stars</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2plus" id="2plus" />
                  <Label htmlFor="2plus">2+ Stars</Label>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="filesize">
            <AccordionTrigger>File Size</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <Slider defaultValue={[5]} max={20} step={1} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 GB</span>
                  <span>5 GB</span>
                  <span>20+ GB</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="flex gap-2">
        <Button className="flex-1">Apply Filters</Button>
        <Button variant="outline" className="flex-1">
          Reset
        </Button>
      </div>
    </div>
  )
}
