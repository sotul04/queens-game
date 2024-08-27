package main

import (
	"fmt"
	"net/http"
	"queenssolver/model"
	"queenssolver/solver"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type BoardRequest struct {
	Board [][]string `json:"board"`
	Mode  string     `json:"mode"`
}

type SolveResponse struct {
	Status string  `json:"status"`
	Path   [][]int `json:"path"`
}

func main() {
	port := ":8080"

	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	r.Use(cors.New(config))

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API ready to use!")
	})

	r.POST("/solve", solveBoard)

	r.Run(port)

}

func solveBoard(c *gin.Context) {
	var request BoardRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	boardMatrix := make([][]rune, len(request.Board))
	for i, row := range request.Board {
		boardMatrix[i] = make([]rune, len(row))
		for j, char := range row {
			boardMatrix[i][j] = rune(char[0])
		}
	}

	board := model.Board{Table: boardMatrix}
	solver := solver.DefaultSolver{Board: &board}
	mode := "default"
	if _, exists := model.RULES[request.Mode]; exists {
		mode = request.Mode
	}

	solution := solver.Solve(model.RULES[mode])

	if solution != nil {
		fmt.Println("Found")
		pathPoints := [][]int{}
		for _, point := range *solution {
			pathPoints = append(pathPoints, []int{point.X, point.Y})
		}
		c.JSON(http.StatusOK, SolveResponse{
			Status: "success",
			Path:   pathPoints,
		})
	} else {
		c.JSON(http.StatusOK, SolveResponse{
			Status: "failed",
		})
	}
}
