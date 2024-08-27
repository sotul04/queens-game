package solver

import (
	"queenssolver/model"
)

type DefaultSolver struct {
	Board *model.Board
}

func (ds *DefaultSolver) Solve(rule func(a, b model.Point) bool) *map[rune]model.Point {
	areas := ds.Board.GetAreas()
	queens := []rune{}
	for char := range areas {
		queens = append(queens, char)
	}

	nqueens := len(queens)
	solution := make(map[rune]model.Point)

	var DFS func(path *model.Point, i int) bool
	DFS = func(path *model.Point, i int) bool {
		if i == nqueens {
			return true
		}

		for _, queen := range areas[queens[i]] {
			if path == nil || !path.IsViolate(queen, rule) {
				solution[queens[i]] = queen

				if DFS(&model.Point{X: queen.X, Y: queen.Y, Before: path}, i+1) {
					return true
				}

				delete(solution, queens[i])
			}
		}
		return false
	}

	DFS(nil, 0)

	if len(solution) != nqueens {
		return nil
	}

	return &solution
}
