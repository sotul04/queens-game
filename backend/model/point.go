package model

import "fmt"

type Point struct {
	X      int
	Y      int
	Before *Point
}

func (p Point) IsEqual(other Point) bool {
	return p.X == other.X && p.Y == other.Y
}

func (p Point) IsDiagonal(other Point) bool {
	return abs(p.X-other.X) == abs(p.Y-other.Y)
}

func (p Point) IsVertical(other Point) bool {
	return p.X == other.X
}

func (p Point) IsHorizontal(other Point) bool {
	return p.Y == other.Y
}

func (p Point) GenerateKnightMoves() []Point {
	moves := []Point{}
	low := []int{-1, 1}
	high := []int{-2, 2}
	for _, x := range low {
		for _, y := range high {
			moves = append(moves, Point{p.X + x, p.Y + y, nil})
		}
	}
	for _, x := range high {
		for _, y := range low {
			moves = append(moves, Point{p.X + x, p.Y + y, nil})
		}
	}
	return moves
}

func (p Point) IsKnight(other Point) bool {
	moves := other.GenerateKnightMoves()
	for _, move := range moves {
		if p.IsEqual(move) {
			return true
		}
	}
	return false
}

func (p Point) IsViolate(newPoint Point, rule func(a, b Point) bool) bool {
	if !rule(p, newPoint) {
		return true
	}
	if p.Before != nil {
		return p.Before.IsViolate(newPoint, rule)
	}
	return false
}

func (p Point) Print() {
	fmt.Printf("x: %d \ty: %d\n", p.X, p.Y)
}

func abs(a int) int {
	if a < 0 {
		return -a
	}
	return a
}
