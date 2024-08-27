import { Block } from "./block";

interface BoardProps {
    board: string[][];
    color: Map<string, string>;
    onBlockClick: (char: string, x: number, y: number) => void;
    disabled?: boolean;
    solution?: number[][] | null
}

export function Board({ board, color, onBlockClick, solution = null, disabled = false }: BoardProps) {

    if (solution) {
        const boardBlock: Array<Array<boolean>> = board.map(row => row.map(_ => false));
        for (const [x, y] of solution) {
            boardBlock[x][y] = true
        }
        return <div className="flex flex-col gap-1">
            {
                boardBlock.map((row, x) => <div key={x} className="flex gap-1">
                    {
                        row.map((isPosition, y) => <Block key={y} color={color.get(board[x][y]) ?? "#555555"} char={isPosition? "#" : ""} onClick={() => { }} disabled={disabled} />
                        )
                    }
                </div>)
            }
        </div>
    }

    return <div className="flex flex-col gap-1">
        {
            board.map((row, x) => <div key={x} className="flex gap-1">
                {
                    row.map((cell, y) => <Block key={y} color={color.get(cell) ?? "#555555"} char="" onClick={() => {
                        onBlockClick(cell, x, y);
                    }} disabled={disabled} />
                    )
                }
            </div>)
        }
    </div>
}