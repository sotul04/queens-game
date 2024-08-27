interface ColorPickProps {
    color: Map<string, string>;
    selected?: string | null;
    onSelect: (color: string) => void
}

export function ColorPick({color, selected = null, onSelect}: ColorPickProps) {

    const colorMap = new Array<{char: string, hex: string}>()
    
    color.forEach((val, key) => colorMap.push({char: key, hex: val}));

    return <div className="flex gap-2 items-center justify-center">
        {
            colorMap.map((item, index) => 
            <button
                key={index}
                style={{
                    backgroundColor: item.hex
                }}
                className={`rounded-md h-6 w-6 shadow-md ${item.char === selected ? 'border-2' : ''}`}
                onClick={() => onSelect(item.char)}
            >
            </button>)
        }
    </div>
}