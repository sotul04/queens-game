import { charColorMap } from "./color";

function hslToHex(hue: number, saturation: number, lightness: number): string {
    saturation /= 100;
    lightness /= 100;

    const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
    const x = chroma * (1 - Math.abs((hue / 60) % 2 - 1));
    const m = lightness - chroma / 2;

    let r = 0, g = 0, b = 0;

    if (hue >= 0 && hue < 60) {
        r = chroma;
        g = x;
        b = 0;
    } else if (hue >= 60 && hue < 120) {
        r = x;
        g = chroma;
        b = 0;
    } else if (hue >= 120 && hue < 180) {
        r = 0;
        g = chroma;
        b = x;
    } else if (hue >= 180 && hue < 240) {
        r = 0;
        g = x;
        b = chroma;
    } else if (hue >= 240 && hue < 300) {
        r = x;
        g = 0;
        b = chroma;
    } else if (hue >= 300 && hue < 360) {
        r = chroma;
        g = 0;
        b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

function generateColorMap(uniqueChars: Set<string>): Map<string, string> {
    const colorMap = new Map<string, string>();
    for (const char of Array.from(uniqueChars)) {
        colorMap.set(char, charColorMap.get(char)!);
    }
    return colorMap;
}

export function addNewColor(existingColorMap: Map<string, string>): Map<string, string> {
    let newChar: string;
    const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()!~+-';
    do {
        newChar = possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
    } while (existingColorMap.has(newChar));

    existingColorMap.set(newChar, charColorMap.get(newChar)!);

    return existingColorMap;
}

export type ModifyBoardAction = 'addRow' | 'removeRow' | 'addColumn' | 'removeColumn'

export function modifyBoard(board: string[][], action: ModifyBoardAction): string[][] {
    const newBoard = board.map(row => [...row]);

    switch (action) {
        case 'addRow': {
            const pos = newBoard.length;
            let newRow: string[];

            if (pos > 0 && pos <= newBoard.length) {
                newRow = [...newBoard[pos - 1]];
            } else if (pos === 0 && newBoard.length > 0) {
                newRow = [...newBoard[0]];
            } else {
                newRow = new Array(newBoard[0]?.length || 0).fill('0');
            }
            newBoard.splice(pos, 0, newRow);
            console.log(newBoard);
            break;
        }
        case 'removeRow': {
            const position = newBoard.length - 1;
            if (position >= 0 && position < newBoard.length) {
                newBoard.splice(position, 1);
            }
            break;
        }
        case 'addColumn': {
            const pos = newBoard[0].length;

            newBoard.forEach(row => {
                let newValue: string;

                if (pos > 0 && pos <= row.length) {
                    newValue = row[pos - 1];
                } else if (pos === 0 && row.length > 0) {
                    newValue = row[0];
                } else {
                    newValue = '0';
                }

                row.splice(pos, 0, newValue);

            });
            console.log(newBoard);
            break;
        }
        case 'removeColumn': {
            const position = newBoard[0].length - 1;
            newBoard.forEach(row => {
                if (position >= 0 && position < row.length) {
                    row.splice(position, 1);
                }
            });
            break;
        }
    }
    return newBoard;
}

function isRegionConnected(board: string[][], char: string, visited: boolean[][], startX: number, startY: number): boolean {
    const rows = board.length;
    const cols = board[0].length;

    const directions = [
        { x: 1, y: 0 },  // down
        { x: -1, y: 0 }, // up
        { x: 0, y: 1 },  // right
        { x: 0, y: -1 }  // left
    ];

    const queue: Array<{ x: number, y: number }> = [];
    queue.push({ x: startX, y: startY });
    visited[startX][startY] = true;

    while (queue.length > 0) {
        const { x, y } = queue.shift()!;

        for (const direction of directions) {
            const newX = x + direction.x;
            const newY = y + direction.y;

            if (newX >= 0 && newX < rows && newY >= 0 && newY < cols && !visited[newX][newY] && board[newX][newY] === char) {
                visited[newX][newY] = true;
                queue.push({ x: newX, y: newY });
            }
        }
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (board[i][j] === char && !visited[i][j]) {
            }
        }
    }

    return true;
}

export function validateConnectedRegions(board: string[][]): boolean {
    const rows = board.length;
    const cols = board[0].length;

    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const uniqueChars = new Set<string>();

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            uniqueChars.add(board[i][j]);
        }
    }

    for (const char of Array.from(uniqueChars)) {
        let foundStart = false;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (board[i][j] === char && !visited[i][j]) {
                    if (foundStart) {
                        return false;
                    }
                    if (!isRegionConnected(board, char, visited, i, j)) {
                        return false;
                    }
                    foundStart = true;
                }
            }
        }
    }

    return true;
}


export function parseBoardFile(file: File): Promise<{ board: string[][] | null; color: Map<string, string> | null; error: string | null }> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const text = reader.result as string;
            const lines = text.trim().split('\n');

            const dimensionLine = lines[0].trim().split(' ');
            if (dimensionLine.length !== 2) {
                return resolve({
                    board: null,
                    color: null,
                    error: "The file dimension line is not appropriate (expected format: 'rows cols').",
                });
            }

            let rows: number, cols: number;
            try {
                rows = parseInt(dimensionLine[0]);
                cols = parseInt(dimensionLine[1]);
            } catch (error) {
                return resolve({
                    board: null,
                    color: null,
                    error: "The dimensions must be valid integers.",
                });
            }

            const numColorRegions = parseInt(lines[1]);
            if (isNaN(numColorRegions) || numColorRegions <= 0) {
                return resolve({
                    board: null,
                    color: null,
                    error: "The number of color regions must be a valid positive integer.",
                });
            }

            const uniqueChars = new Set<string>();

            const board: string[][] = [];
            for (let i = 2; i < lines.length; i++) {
                const row = lines[i].trim().split(' ');
                if (row.length !== cols) {
                    return resolve({
                        board: null,
                        color: null,
                        error: `Row ${i - 1} does not match the specified column count (${cols}).`,
                    });
                }

                for (const char of row) {
                    if (!/^[\w@#$%^&*()!~`+\-]+$/.test(char)) {
                        return resolve({
                            board: null,
                            color: null,
                            error: `Invalid character '${char}' found in the matrix. Only alphanumeric and selected special characters are allowed.`,
                        });
                    }
                    uniqueChars.add(char);
                }

                board.push(row);
            }

            if (board.length !== rows) {
                return resolve({
                    board: null,
                    color: null,
                    error: `The number of rows does not match the specified row count (${rows}).`,
                });
            }

            if (uniqueChars.size !== numColorRegions) {
                return resolve({
                    board: null,
                    color: null,
                    error: `The number of unique color regions (${uniqueChars.size}) does not match the specified number (${numColorRegions}).`,
                });
            }

            const colorMap = generateColorMap(uniqueChars);

            if (!validateConnectedRegions(board)) {
                return resolve({
                    board: null,
                    color: null,
                    error: "There are color regions that are not connected",
                })
            }

            resolve({
                board,
                color: colorMap,
                error: null,
            });
        };

        reader.onerror = () => {
            reject({
                board: null,
                color: null,
                error: "Failed to read the file.",
            });
        };

        reader.readAsText(file);
    });
}
