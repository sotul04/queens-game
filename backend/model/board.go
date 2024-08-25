package model

type Board struct {
	Table [][]rune
	Size  Size
}

func (b *Board) GetAreas() map[rune][]Point {
	areas := map[rune][]Point{}
	for i, row := range b.Table {
		for j, char := range row {
			if _, exists := areas[char]; exists {
				areas[char] = append(areas[char], Point{i, j, nil})
			} else {
				areas[char] = []Point{{i, j, nil}}
			}
		}
	}
	return areas
}
