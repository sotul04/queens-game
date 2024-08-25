package main

import (
	"fmt"
	"queenssolver/model"
	"queenssolver/solver"
	"time"
)

func main() {
	board := model.Board{Table: [][]rune{{'A', 'A', 'A', '@', '@'}, {'A', 'A', '2', '@', '@'}, {'A', '2', '2', '2', '@'}, {'2', '2', '2', '2', '@'}}, Size: model.Size{Width: 4, Height: 5}}
	solver := solver.DefaultSolver{Board: &board}

	start := time.Now()

	solution := solver.Solve(model.RULES["bishop"])

	elapsed := time.Since(start)

	if solution != nil {
		fmt.Println("solution found")
		for _, point := range solution {
			point.Print()
		}
	} else {
		fmt.Println("solution is not found")
	}

	fmt.Println(elapsed)
}
