package model

var RULES = map[string]func(a, b Point) bool{
	"default": defaultRule,
	"queen":   queenRule,
	"rook":    rookRule,
	"bishop":  bishopRule,
	"knight":  knightRule,
}

func defaultRule(a, b Point) bool {
	if a.IsHorizontal(b) || a.IsVertical(b) {
		return false
	}
	edges := []Point{{b.X + 1, b.Y + 1, nil}, {b.X + 1, b.Y - 1, nil}, {b.X - 1, b.Y + 1, nil}, {b.X - 1, b.Y - 1, nil}}
	for _, edge := range edges {
		if a.IsEqual(edge) {
			return false
		}
	}
	return true
}

func queenRule(a, b Point) bool {
	return !(a.IsDiagonal(b) || a.IsHorizontal(b) || a.IsVertical(b))
}

func rookRule(a, b Point) bool {
	return !(a.IsVertical(b) || a.IsHorizontal(b))
}

func bishopRule(a, b Point) bool {
	return !a.IsDiagonal(b)
}

func knightRule(a, b Point) bool {
	return !a.IsKnight(b)
}
