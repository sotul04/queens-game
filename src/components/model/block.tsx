interface BlockProps {
    color: string;
    char?: string;
    onClick: () => void;
    disabled?: boolean
}

export function Block({color, char = "", onClick, disabled = false}: BlockProps) {
    return <button 
        className={`w-8 h-8 border-none rounded-sm`} 
        onClick={() => onClick()} 
        disabled={disabled}
        style={{
            backgroundColor: color
        }}
    >
        <p className="m-auto">{char}</p>
    </button>
} 