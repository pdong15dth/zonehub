"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

export function SourceCodeFilters() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Filters</h3>
        <Accordion type="multiple" defaultValue={["languages", "categories", "sort"]}>
          <AccordionItem value="languages">
            <AccordionTrigger>Languages</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="javascript" />
                  <Label htmlFor="javascript">JavaScript</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="typescript" />
                  <Label htmlFor="typescript">TypeScript</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="csharp" />
                  <Label htmlFor="csharp">C#</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="cpp" />
                  <Label htmlFor="cpp">C++</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="python" />
                  <Label htmlFor="python">Python</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="glsl" />
                  <Label htmlFor="glsl">GLSL</Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="categories">
            <AccordionTrigger>Categories</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="mods" />
                  <Label htmlFor="mods">Mods</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="plugins" />
                  <Label htmlFor="plugins">Plugins</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="frameworks" />
                  <Label htmlFor="frameworks">Frameworks</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="tools" />
                  <Label htmlFor="tools">Tools</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="minigames" />
                  <Label htmlFor="minigames">Mini-games</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="engines" />
                  <Label htmlFor="engines">Engines</Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="sort">
            <AccordionTrigger>Sort By</AccordionTrigger>
            <AccordionContent>
              <RadioGroup defaultValue="popular">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="popular" id="popular" />
                  <Label htmlFor="popular">Most Popular</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recent" id="recent" />
                  <Label htmlFor="recent">Recently Added</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="downloads" id="downloads" />
                  <Label htmlFor="downloads">Most Downloads</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="stars" id="stars" />
                  <Label htmlFor="stars">Most Stars</Label>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="license">
            <AccordionTrigger>License</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="mit" />
                  <Label htmlFor="mit">MIT</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="apache" />
                  <Label htmlFor="apache">Apache 2.0</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="gpl" />
                  <Label htmlFor="gpl">GPL</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="bsd" />
                  <Label htmlFor="bsd">BSD</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="proprietary" />
                  <Label htmlFor="proprietary">Proprietary</Label>
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
