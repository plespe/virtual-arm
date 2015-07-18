package main

import (
  "fmt"
  "math"
  "math/rand"

)

type Coordinate struct {
  x float64
  y float64
}

// Adapted from https://www.jasondavies.com/poisson-disc/ by way of http://bl.ocks.org/mbostock/19168c663618b7f07158
func poissonDiscSampler (width float64, height float64, radius float64) (func() Coordinate) {
  
  k := 30 // maximum number of samples before rejection
  radius2 := radius * radius
  R := 3 * radius2
  cellSize := radius * math.Sqrt(0.5)
  gridWidth := math.Ceil(width / cellSize)
  gridHeight := math.Ceil(height / cellSize)
  bound := int(gridWidth) * int(gridHeight)
  fmt.Println(bound)
  grid := make([]Coordinate, bound)
  queue := make([]Coordinate, 0)
  queueSize := float64(0)
  sampleSize := 0

  return func () (Coordinate) {
    
    if sampleSize == 0 {
      // return sample(rand.Float64() * width, rand.Float64() * height)
      s := Coordinate{x:0.1 , y:0.1}
      queue = append(queue, s)
      grid[int(gridWidth * (0.1 / cellSize) + (0.1 / cellSize))] = s
      sampleSize++
      queueSize++
      return s
    }  

    // Pick a random existing sample and remove it from the queue.
    for queueSize > 0 {
      i := int(rand.Float64() * queueSize)
      s := queue[i];

      // Make a new candidate between [radius, 2 * radius] from the existing sample.
      for j := 0; j < k; j++ {
        var far bool = true
        a := 2 * math.Pi * rand.Float64()
        r := math.Sqrt(rand.Float64() * R + radius2)
        x := s.x + r * math.Cos(a)
        y := s.y + r * math.Sin(a)
        i := x / cellSize
        j := y / cellSize
        i0 := math.Max(i - 2, 0)
        j0 := math.Max(j - 2, 0)
        i1 := math.Min(i + 3, gridWidth)
        j1 := math.Min(j + 3, gridHeight)

        // Reject candidates that are outside the allowed extent, or closer than 2 * radius to any existing sample.
        for j = j0; j < j1; j++ {
          o := j * gridWidth
          for i = i0; i < i1; i++ {

            if s = grid[int(o + i)]; s.x != 0 || s.y != 0 {
              dx := s.x - x
              dy := s.y - y
              if dx * dx + dy * dy < radius2 {
                far = false
              }
            }
          }
        }

        if 0 <= x && x < width && 0 <= y && y < height && far {
          s := Coordinate{x, y}
          queue = append(queue, s)
          grid[int(gridWidth * (y / cellSize) + (x / cellSize))] = s
          sampleSize++
          queueSize++
          return s
        }
      }
    }
  return Coordinate{0, 0}
  }
}

func main() {
  var sample = poissonDiscSampler(100, 100, 10)
  for i := 0; i < 100; i++ {
    fmt.Println(sample())
  }
}
