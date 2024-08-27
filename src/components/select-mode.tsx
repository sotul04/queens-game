import { Label } from "./ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function SelectMode({handleModeChange}: {handleModeChange: (newMode: string) => void}) {
    return <div className="mt-4">
        <Label htmlFor="level-select">Choose Model</Label>
        <Select onValueChange={handleModeChange}>
            <SelectTrigger id="level-select" className="w-[150px]">
                <SelectValue placeholder="Default" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="queen">Queen</SelectItem>
                    <SelectItem value="rook">Rook</SelectItem>
                    <SelectItem value="bishop">Bishop</SelectItem>
                    <SelectItem value="knight">Knight</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    </div>
}