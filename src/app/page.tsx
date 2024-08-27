'use client'

import { Board } from "@/components/model/board";
import { ColorPick } from "@/components/model/color-pick";
import { SelectMode } from "@/components/select-mode";
import { Tabs } from "@/components/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { addNewColor, modifyBoard, parseBoardFile, validateConnectedRegions } from "@/lib/parse";
import { ChangeEvent, useState } from "react";
import { PlusIcon, EraserIcon } from "lucide-react";
import { ModifyBoardAction } from "@/lib/parse";
import { charColorMap } from "@/lib/color";

interface BoardState {
  board: string[][] | null;
  color: Map<string, string> | null;
  mode: string | "default" | "queen" | "rook" | "bishop" | "knight" | undefined;
}

export default function Home() {

  const { toast } = useToast();
  const [boardState, setBoardState] = useState<BoardState>({ board: null, color: null, mode: "default" });
  const [parsingMessage, setParsingMessage] = useState<string | null>(null);
  const [solution, setSolution] = useState<number[][] | null>(null);
  const [currentColor, setCurrentColor] = useState<string | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setSolution(null);
    setCurrentColor(null);
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const result = await parseBoardFile(selectedFile);
      if (result.error || !result.board || !result.color) {
        setParsingMessage(result.error);
        setBoardState(prev => {
          return {
            ...prev,
            board: null,
            color: null
          }
        })
        return;
      }
      setParsingMessage(null);
      setBoardState(prev => {
        return {
          ...prev,
          board: result.board,
          color: result.color
        }
      });
    }
  }

  function handleModeChange(newMode: string) {
    if (newMode === boardState.mode) {
      return
    }
    setBoardState(prev => {
      return {
        ...prev,
        mode: newMode
      }
    })
  }

  async function solve() {
    try {
      const response = await fetch('http://localhost:8080/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'apllication/json',
        },
        body: JSON.stringify({
          board: boardState.board,
          mode: boardState.mode
        })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          toast({
            title: "Board solution received",
          });
          setSolution(data.path);
        } else {
          toast({
            title: "Board has no solution",
          });
          setSolution(null);
        }
      } else {
        toast({
          title: "Error",
          description: 'Something went wrong. The response from solver Server is error.',
          variant: "destructive"
        });
        setSolution(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: 'Something went wrong.',
        variant: "destructive"
      });
      setSolution(null);
    }
  }

  function handleBlockClick(char: string, x: number, y: number) {
    if (currentColor && boardState.board && boardState.color) {

      if (boardState.board[x][y] === currentColor) return;

      const newBoard = boardState.board.map(row => row.map(cell => cell));
      newBoard[x][y] = currentColor;

      if (validateConnectedRegions(newBoard)) {
        setBoardState(prev => {
          return {
            ...prev,
            board: newBoard
          }
        })
      } else {
        toast({
          title: "Opss",
          description: 'Your movement is not permitted',
          variant: "destructive"
        })
      }

    }
  }

  function handleModifyBoard(action: ModifyBoardAction) {
    const newBoard = modifyBoard(boardState.board!, action);
    if (validateConnectedRegions(newBoard)) {
      setBoardState(prev => { return { ...prev, board: newBoard} });
      setSolution(null);
    } else {
      toast({
        title: "Opss",
        description: "The action can't be done becuse violating the game rule.",
        variant: "destructive"
      })
    }
  }

  function addColorRegion() {
    if (boardState.color) {
      const newColor = addNewColor(boardState.color);
      setBoardState(prev => {
        return {
          ...prev,
          color: newColor
        }
      })
    }
  }

  function selectColor(newColor: string) {
    if (newColor === currentColor) return;
    setCurrentColor(newColor);
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <h2 className="font-sans font-semibold text-5xl mt-4">Queens Game Solver</h2>
      <section className="w-[65%] mt-10 min-w-[400px] flex flex-col item-center container">
        <Label htmlFor="input-file" className="my-2">Upload your board as <strong>TXT</strong> file</Label>
        <Input
          id="input-file"
          className="cursor-pointer"
          type="file"
          accept=".txt"
          multiple={false}
          onChange={handleFileChange}
        />
        <SelectMode handleModeChange={handleModeChange} />
        {parsingMessage && <Label className="text-red-500 my-2">{parsingMessage}</Label>}
        {boardState.board && boardState.color &&
          <>
            <h3 className="text-center font-semibold my-3">Board</h3>
            <div className="flex flex-row gap-4 items-center justify-center">
              <ColorPick color={boardState.color} selected={currentColor} onSelect={selectColor} />
              <button disabled={boardState.color.size === charColorMap.size} className="rounded-full bg-slate-300 shadow-md h-6 w-6 hover:bg-slate-500 transition-all duration-300" onClick={() => addColorRegion()}><PlusIcon /></button>
            </div>
            <div className="flex flex-row my-4 gap-4 items-center justify-center">
              <button onClick={() => handleModifyBoard('addRow')} className="rounded-full text-sm px-2 py-1 inline-flex bg-slate-300 shadow-md hover:bg-slate-500 hover:text-white transition-all duration-300">
                <PlusIcon height={20} />&nbsp;Row
              </button>
              <button onClick={() => handleModifyBoard('removeRow')} disabled={boardState.board.length <= 1} className="rounded-full text-sm px-2 py-1 inline-flex bg-slate-300 shadow-md hover:bg-slate-500 hover:text-white transition-all duration-300">
                <EraserIcon height={20} />&nbsp;Row
              </button>
              <button onClick={() => handleModifyBoard('addColumn')} className="rounded-full text-sm px-2 py-1 inline-flex bg-slate-300 shadow-md hover:bg-slate-500 hover:text-white transition-all duration-300">
                <PlusIcon height={20} />&nbsp;Column
              </button>
              <button onClick={() => handleModifyBoard('removeColumn')} disabled={boardState.board.length <= 0 || boardState.board[0].length <= 1} className="rounded-full text-sm px-2 py-1 inline-flex bg-slate-300 shadow-md hover:bg-slate-500 hover:text-white transition-all duration-300">
                <EraserIcon height={20} />&nbsp;Column
              </button>
            </div>
            <div className="mx-auto my-1">
              <Board board={boardState.board} color={boardState.color} onBlockClick={handleBlockClick} />
            </div>
            <Button className="mx-auto bg-slate-700 mt-3 hover:bg-amber-950" onClick={() => solve()}>Solve</Button>
          </>
        }
        {solution && boardState.board && boardState.color && <div className="mx-auto my-3">
          <h3 className="text-center font-semibold mb-3">Solution</h3>
          <Board board={boardState.board} solution={solution} color={boardState.color} onBlockClick={(char, x, y) => { }} disabled />
        </div>}
      </section>
    </main>
  );
}
